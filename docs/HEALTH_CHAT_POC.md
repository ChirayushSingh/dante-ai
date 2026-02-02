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

## Supabase deploy secrets (CI)

To enable automatic deployment of the Supabase function from the CI workflow, add the following secrets to your GitHub repository settings:

- `SUPABASE_ACCESS_TOKEN` - a personal access token with permissions to deploy functions. You can create one using the Supabase CLI or from the Supabase project dashboard. Steps (short):
  1. Install the Supabase CLI (https://supabase.com/docs/guides/cli).
  2. Run `supabase login` and follow the prompt to authenticate.
  3. Use `supabase projects tokens create --name "ci-deploy"` or create a token in the dashboard and copy the value.
  4. Save the token as `SUPABASE_ACCESS_TOKEN` in GitHub repository secrets.

- `SUPABASE_PROJECT_REF` - the project reference (project id) for your Supabase project. You can find this in the Supabase dashboard project's settings.

When these secrets are present, the workflow will attempt to log in and deploy `health-chat-openai` on feature branch pushes. If secrets are not configured, the workflow will run tests but skip deployment.

> ⚠️ Security note: store these secrets in GitHub Secrets and **do not** hard-code any credentials in the repository. For production deployments, consider using a CI service account with least privilege and rotate keys regularly.

> Note: If you prefer manual PR deploys, create the PR and trigger a workflow run or run `supabase functions deploy health-chat-openai` locally after linking your project.

## Notes & Safety

- This PoC is NOT HIPAA-compliant. The HIPAA storage behavior is a **mock** and only simulates encrypting and logging an encrypted payload. Do not treat it as real secure storage.
- The red-flag detection is a simple keyword match used for demonstration only. Clinical triage must be done by qualified clinicians and validated rules.

## How to test

1. Set `OPENAI_API_KEY` in your environment and deploy the Supabase functions, or run the function locally using Deno.
2. Start the app and open the Health Chat UI. Toggle `Use OpenAI PoC` and try sample messages.
3. Toggle `Mock HIPAA Save` to simulate encrypted storage of scrubbed messages.
