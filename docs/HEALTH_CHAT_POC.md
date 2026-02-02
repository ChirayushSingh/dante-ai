# Health Chat OpenAI PoC

This PoC adds:

- Frontend UI controls in `HealthChatbot.tsx` to select a persona, empathy level, enable OpenAI PoC, and toggle mock HIPAA save.
- New prompt templates at `src/lib/healthPrompts.ts`.
- A Supabase Edge Function `supabase/functions/health-chat-openai` that:
  - Accepts `messages` and `options` `{ persona, empathy, saveHipaa }`.
  - Performs basic PII scrubbing (demo only) and a mock HIPAA "encrypt and store" step.
  - Detects red-flag symptoms and immediately returns an emergency message.
  - Forwards sanitized conversation to OpenAI Chat Completions (streaming) and proxies the stream back to the client.

## Env vars (local .env or deployment)

- `OPENAI_API_KEY` - required for OpenAI PoC.
- `OPENAI_MODEL` - optional, default `gpt-4o-mini`.
- `VITE_USE_OPENAI_POC` - if set to `true`, front-end `useHealthChat` will use the OpenAI PoC endpoint by default.

## Notes & Safety

- This PoC is NOT HIPAA-compliant. The HIPAA storage behavior is a **mock** and only simulates encrypting and logging an encrypted payload. Do not treat it as real secure storage.
- The red-flag detection is a simple keyword match used for demonstration only. Clinical triage must be done by qualified clinicians and validated rules.

## How to test

1. Set `OPENAI_API_KEY` in your environment and deploy the Supabase functions, or run the function locally using Deno.
2. Start the app and open the Health Chat UI. Toggle `Use OpenAI PoC` and try sample messages.
3. Toggle `Mock HIPAA Save` to simulate encrypted storage of scrubbed messages.
