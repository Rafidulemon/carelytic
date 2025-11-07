# Carelytic · Medical Report Reader AI

Carelytic ingests uploaded medical documents, stores them in Cloudflare R2, and generates structured AI insights with OpenAI. The product tracks a user’s credit balance, deducts credits per upload/analysis, and keeps a full report history that can be revisited from the dashboard.

## Features
- Drag-and-drop uploader with file-size guardrails (PDF, DOC/DOCX, JPG/PNG up to 5 MB)
- Cloudflare R2 storage + signed metadata passed to the AI analyzer
- OpenAI GPT-4.1-mini responses parsed into summaries, detailed insights, and next steps
- User credit ledger with automatic deductions and transaction logging
- Prisma-backed history API for account dashboards and the `/reports/[id]` view
- Bilingual prompts (English + Bangla) and localized UI copy

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (with custom gradients + utility classes)
- **Database:** PostgreSQL (Neon-compatible) accessed via Prisma ORM
- **Auth & Hashing:** Bcrypt-powered password flow plus client auth context
- **Storage:** Cloudflare R2 (S3-compatible API via `@aws-sdk/client-s3`)
- **AI:** OpenAI Responses + Files APIs
- **Tooling:** ESLint, tsx-based Prisma seeding, npm scripts

## Prerequisites
- Node.js 20 LTS (or newer) and npm
- PostgreSQL instance (Neon hosted or local Docker)
- Cloudflare R2 bucket + API credentials
- OpenAI API key with access to `gpt-4.1-mini`

## Environment Variables
Create a `.env` file in the project root with at least the following keys:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Prisma format) |
| `S3_BUCKET` | Cloudflare R2 bucket name |
| `S3_ENDPOINT` | R2 endpoint URL (e.g., `https://<account-id>.r2.cloudflarestorage.com`) |
| `S3_REGION` | Region string (`auto` for R2) |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | API credentials for the bucket |
| `S3_TOKEN_VALUE` | R2 scoped token if required for uploads |
| `OPENAI_API_KEY` | OpenAI API key with file upload + responses access |
| `NEON_DATABASE_URL` (optional alias) | If you keep a separate Neon connection string, reference it here and mirror it to `DATABASE_URL` |

> Never commit real secrets. Create a sanitized `.env.example` if you plan to share the project.

## Getting Started
```bash
# 1. Install deps
npm install

# 2. Apply migrations (or `npx prisma db push` while prototyping)
npx prisma migrate deploy

# 3. Seed demo data (creates three users with credits/passwords)
npx prisma db seed

# 4. Run the dev server
npm run dev
```

Visit `http://localhost:3000` to access the app. Prisma seeds the following test accounts (phone + password):

## Useful Scripts
- `npm run dev` – start the Next.js dev server
- `npm run lint` – run ESLint across the repo
- `npm run build` / `npm run start` – production build & serve
- `npx prisma studio` – inspect the database via Prisma Studio

## Deployment Notes
1. Ensure `DATABASE_URL`, `OPENAI_API_KEY`, and all R2 credentials exist in your hosting provider’s secret store.
2. Run `npx prisma migrate deploy` on deploy (Vercel `postinstall` hook works well).
3. For Cloudflare R2, allow PUT/GET for the configured bucket and set CORS to accept your frontend origin.
4. Monitor OpenAI usage: each upload creates an assistant file and response. Clean-up is handled automatically, but keep an eye on quotas.

## Contributing
1. Fork & create a feature branch.
2. Follow the ESLint rules (`npm run lint` must pass).
3. Keep Prisma schema changes in migrations and update `prisma/seed.ts` if new defaults are introduced.
4. Submit a PR with a concise description and screenshots or API samples if applicable.
