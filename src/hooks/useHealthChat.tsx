import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`;

// Simulation responses for demo purposes
const SIMULATED_RESPONSES = [
  { keywords: ["headache", "pain", "head"], response: "I understand you're experiencing a headache. To help me analyze this better, could you tell me:\n\n1. How long does the pain last?\n2. Is it on one side or both sides?\n3. Do you have any sensitivity to light or sound?" },
  { keywords: ["tired", "fatigue", "sleepy"], response: "It sounds like you're feeling fatigued. This can be caused by many factors including sleep quality, stress, or nutrition. How many hours of sleep have you been getting lately?" },
  { keywords: ["fever", "hot", "temperature"], response: "I see you're asking about fever-like symptoms. Have you measured your temperature? A fever is generally considered to be 100.4°F (38°C) or higher." },
  { keywords: ["stomach", "pain", "belly"], response: "Stomach discomfort can be distressing. Are you experiencing any other symptoms like nausea, bloating, or changes in appetite?" },
];

const DEFAULT_RESPONSE = "Thank you for sharing that. Based on common medical knowledge, this could be related to several factors. However, for a precise diagnosis, I recommend consulting with a healthcare provider. Is there anything specific you'd like to know about these symptoms?";

export function useHealthChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const CHAT_OPENAI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat-openai`;

  const startNewConversation = useCallback(async () => {
    // For demo/simulation, we don't block on user auth or DB creation
    setMessages([]);

    // Attempt DB creation but don't fail if it doesn't work (Simulation Mode)
    if (user) {
      try {
        const { data, error } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            conversation_type: "health_chat",
            title: "Health Chat",
          })
          .select()
          .single();

        if (!error && data) {
          setConversationId(data.id);
        }
      } catch (e) {
        console.warn("Used simulation mode for conversation creation", e);
      }
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hello! I'm Diagnova AI, your health assistant. I can help analyze symptoms, explain medical terms, and guide your wellness journey.\n\nTell me what you're feeling, or ask a question like:\n\n* \"I have a throbbing headache on the left side\"\n* \"What are the signs of dehydration?\"\n* \"How can I improve my sleep quality?\"",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user]);

  const sendMessage = useCallback(async (content: string, options?: { persona?: string; empathy?: string; useOpenAIPoC?: boolean; saveHipaa?: boolean }) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 1. Try to save to DB (Best Effort)
      if (conversationId) {
        supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "user",
          content: content.trim(),
        }).then().catch(err => console.warn("Failed to save message", err));
      }

      // Choose endpoint: OpenAI PoC if requested or forced by env
      const useOpenAI = options?.useOpenAIPoC || import.meta.env.VITE_USE_OPENAI_POC === "true";
      const targetUrl = useOpenAI ? CHAT_OPENAI_URL : CHAT_URL;

      // 2. Try Real Backend First
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })), options }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error:", response.status, errorText);
        toast.error(`Chat connection error (${response.status}). Using offline mode.`);
        throw new Error(`Backend unavailable: ${response.status}`);
      }

      // Process Stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantContent = "";
      let assistantMessageId = crypto.randomUUID();

      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Handle SSE "data: " prefix and multiple chunks in one message
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const jsonString = line.replace("data: ", "");
              const parsed = JSON.parse(jsonString);
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                assistantContent += content;
                setMessages(prev => prev.map(m =>
                  m.id === assistantMessageId
                    ? { ...m, content: m.content + content }
                    : m
                ));
              }
            } catch (e) {
              console.warn("Failed to parse stream chunk", e);
            }
          }
        }
      }

      // Optionally persist assistant message
      if (conversationId) {
        supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: assistantContent,
        }).then().catch(err => console.warn("Failed to save assistant message", err));
      }

    } catch (error) {
      // SIMULATION MODE IMPLEMENTATION
      console.log("Using Simulation Mode due to error:", error);

      // Artificial delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      let simulatedResponse = DEFAULT_RESPONSE;
      const lowerContent = content.toLowerCase();

      for (const sim of SIMULATED_RESPONSES) {
        if (sim.keywords.some(k => lowerContent.includes(k))) {
          simulatedResponse = sim.response;
          break;
        }
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: simulatedResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (conversationId) {
        supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: simulatedResponse,
        }).then().catch(e => console.warn("Failed to save simulated msg", e));
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, conversationId]);

  return {
    messages,
    isLoading,
    conversationId,
    sendMessage,
    startNewConversation,
  };
}