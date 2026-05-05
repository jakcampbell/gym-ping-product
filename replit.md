# Gym Ping

A web app for tracking gym attendance — users log daily check-ins (went/skipped), see weekly stats, and build streaks. Each user has their own isolated data.

## Run & Operate

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

**Required env vars** (auto-provisioned):
- `DATABASE_URL`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` — PostgreSQL
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` — Clerk auth
- `SESSION_SECRET` — session signing

## Stack

- **Frontend**: React + Vite (Tailwind v4, wouter, @tanstack/react-query)
- **Auth**: Clerk (`@clerk/react` on frontend, `@clerk/express` on server)
- **Backend**: Express 5, Node 24
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`, Orval codegen
- **Build**: esbuild (CJS bundle for server)

## Where things live

- `artifacts/gym-ping/` — React+Vite frontend (preview path `/`)
- `artifacts/api-server/` — Express API server (preview path `/api`)
- `lib/api-spec/openapi.yaml` — OpenAPI source of truth
- `lib/db/src/schema/gymLogs.ts` — `gym_logs` DB table
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas

## Architecture decisions

- **OpenAPI-first**: all endpoints defined in `openapi.yaml`, then codegen produces hooks + Zod validators. Never hand-write types the codegen provides.
- **Clerk proxy**: server mounts `clerkProxyMiddleware` at `/api/__clerk`; production proxy is auto-configured by Replit. Dev uses Clerk CDN directly (no VITE_CLERK_PROXY_URL needed).
- **Per-user data isolation**: all gym_logs rows scoped by `user_id` (Clerk user ID). No cross-user data leakage.
- **Upsert on date**: `POST /gym-logs` upserts on `(user_id, date)` unique constraint — user can change their answer for today.
- **api-zod barrel**: only exports `./generated/api` (Zod schemas), not `./generated/types` (would cause duplicate export errors with Orval v8 output).

## Product

- Public landing page: problem/solution/target/metrics cards + CTAs
- Sign up / sign in with email or Google (Clerk)
- Dashboard: daily check-in (went / skipped), weekly goal, completed days, streak, progress bar
- Each user sees only their own data; signing in from any device restores your history

## User preferences

- App is a class project by Jakob Campbell, deployed to `jakobcampbell.me` via Azure Static Web Apps + GitHub Actions
- Azure deployment uses `skip_app_build: true`, `app_location: "artifacts/gym-ping/dist/public"`

## Gotchas

- Do not run `pnpm dev` at workspace root — artifacts use workflow-managed dev servers
- After changing `openapi.yaml`, always re-run `pnpm --filter @workspace/api-spec run codegen`
- `lib/api-zod/src/index.ts` must only export `./generated/api` — adding `./generated/types` causes TS2308 duplicate export errors
- Tailwind v4 + Clerk: `@layer theme, base, clerk, components, utilities;` must come before `@import "tailwindcss"` in `index.css`, and `tailwindcss({ optimize: false })` in `vite.config.ts`

## Pointers

- Clerk auth setup: `.local/skills/clerk-auth/references/setup-and-customization.md`
- OpenAPI codegen: `.local/skills/pnpm-workspace/references/openapi.md`
- DB schema: `.local/skills/pnpm-workspace/references/db.md`
