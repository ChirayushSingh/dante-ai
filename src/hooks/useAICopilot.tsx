import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useHealthProfile } from "./useHealthProfile";
import { toast } from "sonner";

export interface CopilotContext {
  lastSymptoms: string[];
  lastPredictions: any[];
  lastCheckDate: Date | null;
  userName: string;
  healthGoal: string | null;
  recentTopics: string[];
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    isFollowUp?: boolean;
    relatedSymptoms?: string[];
  };
}

export function useAICopilot() {
  const { user } = useAuth();
  const { profile, conditions, medications, getHealthContext } = useHealthProfile();
  const queryClient = useQueryClient();

  // Fetch all user conversations for context
  const { data: allConversations } = useQuery({
    queryKey: ["allConversations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch all messages from recent conversations
  const { data: recentMessages } = useQuery({
    queryKey: ["recentMessages", user?.id],
    queryFn: async () => {
      if (!user || !allConversations?.length) return [];
      
      const recentConvoIds = allConversations.slice(0, 10).map(c => c.id);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .in("conversation_id", recentConvoIds)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!allConversations?.length,
  });

  // Fetch symptom check history
  const { data: symptomHistory } = useQuery({
    queryKey: ["symptomHistory", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("symptom_checks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Build comprehensive context for AI
  const buildCopilotContext = useCallback((): CopilotContext => {
    const lastCheck = symptomHistory?.[0];
    const symptoms = Array.isArray(lastCheck?.symptoms) ? lastCheck.symptoms as string[] : [];
    const predictions = Array.isArray(lastCheck?.predictions) ? lastCheck.predictions as any[] : [];
    
    return {
      lastSymptoms: symptoms,
      lastPredictions: predictions,
      lastCheckDate: lastCheck ? new Date(lastCheck.created_at) : null,
      userName: profile?.full_name?.split(" ")[0] || "there",
      healthGoal: profile?.subscription_tier === "pro" ? "wellness" : null,
      recentTopics: extractRecentTopics(),
    };
  }, [symptomHistory, profile, recentMessages]);

  // Extract topics from recent messages
  const extractRecentTopics = (): string[] => {
    if (!recentMessages?.length) return [];
    
    const topics = new Set<string>();
    const keywords = ["headache", "fever", "pain", "fatigue", "cough", "nausea", "anxiety", "stress", "sleep"];
    
    recentMessages.forEach(msg => {
      keywords.forEach(keyword => {
        if (msg.content.toLowerCase().includes(keyword)) {
          topics.add(keyword);
        }
      });
    });
    
    return Array.from(topics).slice(0, 5);
  };

  // Generate personalized greeting based on context
  const generateGreeting = useCallback((): string => {
    const context = buildCopilotContext();
    const greeting = `Hello, ${context.userName}! `;
    
    if (context.lastCheckDate) {
      const daysSinceCheck = Math.floor(
        (Date.now() - context.lastCheckDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceCheck === 0) {
        const lastSymptom = context.lastSymptoms[0];
        if (lastSymptom) {
          return greeting + `I hope you're feeling better. Last time you mentioned some health concerns. How are those symptoms now?`;
        }
        return greeting + "How are you feeling since your last check-in today?";
      }
      
      if (daysSinceCheck === 1) {
        return greeting + "Good to see you again! How did things go since yesterday?";
      }
      
      if (daysSinceCheck <= 7) {
        if (context.recentTopics.length > 0) {
          return greeting + `Welcome back! You mentioned ${context.recentTopics[0]} last time. Is that still bothering you?`;
        }
        return greeting + "Welcome back! How have you been feeling this week?";
      }
      
      return greeting + "It's been a while since your last check-in. How are you doing?";
    }
    
    return greeting + "I'm your AI health assistant. I can help you understand symptoms, answer health questions, and track your wellness over time. What can I help you with today?";
  }, [buildCopilotContext]);

  // Generate follow-up suggestions based on history
  const generateFollowUpSuggestions = useCallback((): string[] => {
    const context = buildCopilotContext();
    const suggestions: string[] = [];
    
    if (context.lastSymptoms.length > 0) {
      suggestions.push(`Check if ${context.recentTopics[0] || "previous symptoms"} have improved`);
    }
    
    if (conditions?.length) {
      suggestions.push("Get tips for managing your chronic conditions");
    }
    
    if (medications?.length) {
      suggestions.push("Learn about potential medication interactions");
    }
    
    suggestions.push("Start a new symptom check");
    suggestions.push("View your health timeline");
    
    return suggestions.slice(0, 4);
  }, [buildCopilotContext, conditions, medications]);

  // Build context summary for AI prompts
  const buildContextSummary = useCallback((): string => {
    const context = buildCopilotContext();
    const healthContext = getHealthContext?.() || { age: null, gender: null, conditions: [], medications: [], allergies: [] };
    
    let summary = "USER CONTEXT:\n";
    summary += `Name: ${context.userName}\n`;
    
    if (healthContext.age) summary += `Age: ${healthContext.age}\n`;
    if (healthContext.gender) summary += `Gender: ${healthContext.gender}\n`;
    if (healthContext.conditions?.length) {
      summary += `Chronic conditions: ${healthContext.conditions.join(", ")}\n`;
    }
    if (healthContext.medications?.length) {
      summary += `Current medications: ${healthContext.medications.join(", ")}\n`;
    }
    
    if (context.lastCheckDate) {
      const daysSince = Math.floor(
        (Date.now() - context.lastCheckDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      summary += `Last symptom check: ${daysSince} days ago\n`;
      
      if (context.lastSymptoms.length > 0) {
        summary += `Previous symptoms: ${context.lastSymptoms.slice(0, 3).join(", ")}\n`;
      }
    }
    
    if (context.recentTopics.length > 0) {
      summary += `Recent health topics: ${context.recentTopics.join(", ")}\n`;
    }
    
    return summary;
  }, [buildCopilotContext, getHealthContext]);

  return {
    context: buildCopilotContext(),
    greeting: generateGreeting(),
    followUpSuggestions: generateFollowUpSuggestions(),
    contextSummary: buildContextSummary(),
    symptomHistory,
    recentMessages,
    allConversations,
    isLoading: !symptomHistory || !recentMessages,
  };
}
