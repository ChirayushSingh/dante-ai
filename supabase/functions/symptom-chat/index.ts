import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a compassionate, professional medical symptom assessment AI assistant. Your role is to conduct a thorough but friendly symptom interview.

IMPORTANT GUIDELINES:
1. Ask ONE focused follow-up question at a time to gather more details
2. Be empathetic and reassuring in your tone
3. After gathering enough information (usually 3-5 exchanges), provide your assessment
4. NEVER diagnose definitively - always recommend professional consultation
5. Include urgency level in your final assessment

When you have enough information, provide a structured assessment in this exact JSON format:
{
  "isAssessment": true,
  "predictions": [
    {
      "condition": "Condition Name",
      "confidence": 0.85,
      "explanation": "Brief explanation of why this might be the cause",
      "severity": "mild|moderate|severe"
    }
  ],
  "urgencyLevel": "self_care|consult_soon|urgent|emergency",
  "urgencyExplanation": "Clear explanation of the urgency recommendation",
  "summary": "A caring summary of the conversation and recommendations",
  "recommendations": ["Specific recommendation 1", "Recommendation 2"]
}

If you're still gathering information, respond naturally as a caring health assistant. Ask about:
- Location and nature of symptoms
- Duration and onset
- Severity (1-10 scale)
- Associated symptoms
- Relevant medical history
- Current medications
- Recent changes in health or lifestyle

Always include the medical disclaimer that this is for educational purposes only.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, healthProfile } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from health profile if available
    let profileContext = "";
    if (healthProfile) {
      const parts = [];
      if (healthProfile.age) parts.push(`Age: ${healthProfile.age}`);
      if (healthProfile.gender) parts.push(`Gender: ${healthProfile.gender}`);
      if (healthProfile.conditions?.length) parts.push(`Chronic conditions: ${healthProfile.conditions.join(", ")}`);
      if (healthProfile.allergies?.length) parts.push(`Allergies: ${healthProfile.allergies.join(", ")}`);
      if (healthProfile.medications?.length) parts.push(`Current medications: ${healthProfile.medications.join(", ")}`);
      
      if (parts.length > 0) {
        profileContext = `\n\nPatient Health Profile:\n${parts.join("\n")}`;
      }
    }

    const systemMessage = {
      role: "system",
      content: SYSTEM_PROMPT + profileContext
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [systemMessage, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please upgrade your plan." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Symptom chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});