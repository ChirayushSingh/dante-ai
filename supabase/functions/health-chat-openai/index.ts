import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { RED_FLAG_KEYWORDS, detectRedFlags, scrubPII, simulateHipaaEncrypt } from "./utils.ts";

// NOTE: moved PII / red-flag helpers to `utils.ts` to make them unit-testable


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, options } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Missing messages array" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const lastUser = messages.slice().reverse().find((m: any) => m.role === "user");
    const lastContent = (lastUser && String(lastUser.content || "")).toLowerCase();

    const foundRedFlags = RED_FLAG_KEYWORDS.filter(k => lastContent.includes(k));

    const GROQ_KEY = Deno.env.get("GROQ_API_KEY");
    const GROQ_MODEL = Deno.env.get("GROQ_MODEL") || "llama-3.3-70b-versatile";

    if (!GROQ_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    // If red-flag detected, immediately return an urgent, non-diagnostic escalation message
    if (foundRedFlags.length > 0) {
      const urgentMsg = `**EMERGENCY DETECTED**\nWe detected urgent symptoms (e.g., ${foundRedFlags.join(", ")}). This may require immediate medical attention. Please call your local emergency services (e.g., 911) or go to the nearest emergency department now.\n\nI am an AI assistant providing educational information, not medical advice.`;

      // If HIPAA save requested, simulate storing a scrubbed & encrypted record
      if (options?.saveHipaa) {
        const scrubbed = await scrubPII(lastContent);
        const encrypted = simulateHipaaEncrypt(scrubbed);
        // In a real implementation you'd store `encrypted` securely using your HIPAA-compliant store
        console.log("[HIPAA_MOCK] Stored encrypted record id=mock-", crypto.randomUUID());
      }

      return new Response(new TextEncoder().encode(urgentMsg), {
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    // Build system prompt based on options.persona + empathy
    let systemPrompt = "You are a knowledgeable, friendly AI health assistant. Provide evidence-based, general health information. Always include the reminder that you are an AI assistant providing educational information, not medical advice.";

    if (options?.persona === "empathic_primary_care") {
      systemPrompt = "You are an empathetic primary care physician assistant. Use a warm, supportive tone, ask open-ended questions to clarify symptoms, and provide clear next steps. Do not provide diagnoses or prescriptions.";
    } else if (options?.persona === "concise_clinical") {
      systemPrompt = "You are a concise clinical assistant. Ask direct, specific questions focused on diagnostic features. Avoid unnecessary reassuring language. Do not provide diagnoses or prescribe treatments.";
    } else if (options?.persona === "pediatric_nurturing") {
      systemPrompt = "You are a pediatric clinician addressing a caregiver, using nurturing and reassuring language. Ask about feeding, activity, and age-appropriate concerns. Do not provide dosing or definitive diagnoses.";
    }

    if (options?.empathy === "high") {
      systemPrompt += " Use warm, highly empathic and supportive phrasing.";
    } else if (options?.empathy === "low") {
      systemPrompt += " Use a neutral, factual tone.";
    }

    // PII scrub the content we send to OpenAI as a precaution
    const sanitizedMessages: any[] = [];
    for (const m of messages) {
      const s = await scrubPII(String(m.content || ""));
      sanitizedMessages.push({ role: m.role, content: s });
    }

    // Optionally simulate HIPAA save (mock)
    if (options?.saveHipaa) {
      const toSave = JSON.stringify({ messages: sanitizedMessages, meta: { savedAt: new Date().toISOString(), persona: options?.persona } });
      const encrypted = simulateHipaaEncrypt(toSave);
      console.log("[HIPAA_MOCK] encrypted length", encrypted.length);
      // In a real app, write `encrypted` to a secure store and return an id
    }

    // Call Groq Chat Completions (streaming) - OpenAI compatible
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...sanitizedMessages,
        ],
        temperature: 0.2,
        stream: true,
      }),
    });

    if (!groqRes.ok) {
      const errTxt = await groqRes.text();
      console.error("Groq error", groqRes.status, errTxt);
      let errorDetail = "Groq API error";
      try {
        const parsed = JSON.parse(errTxt);
        errorDetail = parsed.error?.message || errTxt;
      } catch (e) {
        errorDetail = errTxt;
      }
      return new Response(JSON.stringify({ error: `Groq Error (${groqRes.status}): ${errorDetail}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Proxy the stream back to client (SSE-like)
    return new Response(groqRes.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("health-chat-openai error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : "";
    return new Response(JSON.stringify({
      error: message,
      details: stack
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
