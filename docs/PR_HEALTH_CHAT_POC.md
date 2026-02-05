# PR: feat(health-chat): OpenAI PoC — persona prompts, emergency detection, HIPAA mock, PII hardening & CI/tests

**Summary**
This PR adds a PoC OpenAI-backed health chat with persona prompts, UI controls, emergency escalation, HIPAA mock save, and progressively stronger PII detection (regex + libphonenumber + Luhn + compromise NLP + optional Google DLP). It also adds tests and a CI workflow to validate behavior and optionally deploy the Supabase Edge Function.

**Branch:** `feature/health-chat-openai-poc` → **Target:** `main`

---

## Key changes
- **New files**
  - `src/lib/healthPrompts.ts` — persona templates & red-flag keywords
  - `supabase/functions/health-chat-openai/index.ts` — OpenAI proxy, emergency detection, HIPAA mock storage
  - `supabase/functions/health-chat-openai/utils.ts` — PII detection/scrubbing utilities (regex, libphonenumber, Luhn, compromise, optional Google DLP)
  - `docs/HEALTH_CHAT_POC.md` — setup & testing docs
  - `docs/PR_HEALTH_CHAT_POC.md` — this PR body (ready-to-paste)
- **Updated files**
  - `src/components/dashboard/HealthChatbot.tsx` — persona / empathy / PoC toggles, emergency banner
  - `src/hooks/useHealthChat.tsx` — sendMessage supports options and can call OpenAI PoC endpoint
  - Tests: Deno tests for PII utils, Vitest tests for hook
  - CI: `.github/workflows/health-chat-poc.yml` — type-check, Vitest, Deno tests, optional Supabase function deploy

---

## Checklist
- [x] Persona-driven prompting and empathy control
- [x] Emergency / red-flag detection + escalation message
- [x] Mock HIPAA save flow (scrub + simulated encrypt)
- [x] PII detection chain: regex → phone parser → Luhn CC → NLP names/places → optional Google DLP
- [x] Unit tests (Deno + Vitest) to cover behaviors
- [x] CI workflow that runs tests and optionally deploys the function when Supabase secrets exist

---

## How to test locally
1. `npm ci`
2. `npm test` (Vitest) and `npm run test:deno` (Deno tests) — ensure environment has Deno or use npx wrapper in CI
3. `npm run dev` and open the Health Chat UI
4. Toggle **Use OpenAI PoC** and send test messages (e.g., "I have chest pain")
5. Optional: set `GOOGLE_DLP_API_KEY` & `GOOGLE_PROJECT_ID` to test DLP-based redaction

---

## Required env / secrets for full PoC
- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional)
- `VITE_USE_OPENAI_POC` (optional)
- `GOOGLE_DLP_API_KEY` & `GOOGLE_PROJECT_ID` (optional for DLP)
- `SUPABASE_ACCESS_TOKEN` & `SUPABASE_PROJECT_REF` (CI deploy; store as GitHub secrets)

> ⚠️ This is a PoC: HIPAA behavior is mocked (not production-compliant). Real deployments require audited key management, secure storage, and compliance review.

---

## Suggested reviewers & labels
- Reviewers: @ChirayushSingh, backend/infrastructure owner, security/compliance reviewer
- Labels: enhancement, security, ci, docs

---

## Acceptance checklist (staging)
See `docs/HEALTH_CHAT_ACCEPTANCE.md` for a small acceptance test checklist covering UI, OpenAI flows, emergency detection, PII redaction, HIPAA mock save, DLP integration, and fallback behavior.

---

If you'd like, I can open the PR using the GitHub API if you provide a temporary token, or you can paste this body into the GitHub PR UI. Thank you!
