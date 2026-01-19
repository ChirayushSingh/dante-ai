import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useHealthProfile } from "./useHealthProfile";
import { toast } from "sonner";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Assessment {
  isAssessment: true;
  predictions: Array<{
    condition: string;
    confidence: number;
    explanation: string;
    severity: "mild" | "moderate" | "severe";
  }>;
  urgencyLevel: "self_care" | "consult_soon" | "urgent" | "emergency";
  urgencyExplanation: string;
  summary: string;
  recommendations: string[];
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/symptom-chat`;

export function useSymptomChat() {
  const { user } = useAuth();
  const { getHealthContext } = useHealthProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const startNewConversation = useCallback(async () => {
    if (!user) return;
    
    setMessages([]);
    setAssessment(null);
    
    // Create conversation in database
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        conversation_type: "symptom_check",
        title: "Symptom Check",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create conversation:", error);
      return;
    }

    setConversationId(data.id);

    // Add welcome message
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hello! I'm your AI health assistant. I'm here to help you understand your symptoms better. Please tell me what's bothering you today - describe your main symptom or concern, and I'll ask some follow-up questions to better understand your situation.\n\n⚠️ Remember: This is for educational purposes only and doesn't replace professional medical advice.",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message to database
    if (conversationId) {
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: content.trim(),
      });
    }

    try {
      const healthContext = getHealthContext();
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          conversationId,
          healthProfile: healthContext,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please wait a moment and try again.");
          setIsLoading(false);
          return;
        }
        if (response.status === 402) {
          toast.error("Usage limit reached. Please upgrade your plan.");
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantContent = "";
      let assistantMessageId = crypto.randomUUID();

      // Add placeholder assistant message
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }]);

      let textBuffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Check if response contains assessment JSON
      try {
        const jsonMatch = assistantContent.match(/\{[\s\S]*"isAssessment":\s*true[\s\S]*\}/);
        if (jsonMatch) {
          const assessmentData = JSON.parse(jsonMatch[0]) as Assessment;
          setAssessment(assessmentData);

          // Save symptom check to database
          if (conversationId && user) {
            await supabase.from("symptom_checks").insert({
              user_id: user.id,
              conversation_id: conversationId,
              symptoms: messages.filter(m => m.role === "user").map(m => m.content),
              predictions: assessmentData.predictions,
              urgency_level: assessmentData.urgencyLevel,
              urgency_explanation: assessmentData.urgencyExplanation,
              ai_summary: assessmentData.summary,
            });

            // Mark conversation as completed
            await supabase
              .from("conversations")
              .update({ status: "completed" })
              .eq("id", conversationId);
          }
        }
      } catch (e) {
        // Not an assessment response, continue conversation
      }

      // Save assistant message to database
      if (conversationId) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: assistantContent,
        });
      }

    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, conversationId, user, getHealthContext]);

  return {
    messages,
    isLoading,
    assessment,
    conversationId,
    sendMessage,
    startNewConversation,
  };
}