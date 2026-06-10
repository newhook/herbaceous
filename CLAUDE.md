@AGENTS.md

# Herbaceous

A small Next.js demo: email/password auth + an herb recommender that suggests
garden herbs based on the foods you like to eat.

> ⚠️ This project uses **Next.js 16** (App Router). See the imported `AGENTS.md`
> — APIs may differ from training data; consult `node_modules/next/dist/docs/`
> before writing Next.js code.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- **Auth.js (NextAuth v5)** — credentials provider, JWT sessions, `trustHost: true`
- **@vercel/postgres** — user storage; `users` table is auto-created on first use
- **bcryptjs** — password hashing
- Rule-based recommendation engine (no external API calls)

## Layout

| Path | Purpose |
| --- | --- |
| `auth.ts` | NextAuth config: credentials provider, `authorize()` checks bcrypt hash against the DB. Exports `auth`, `signIn`, `signOut`, `handlers`. |
| `app/api/auth/[...nextauth]/route.ts` | Re-exports Auth.js `GET`/`POST` handlers. |
| `app/actions.ts` | Server actions: `authenticate` (signin), `register` (signup → create user → signin), `logout`. |
| `app/auth-form.tsx` | Client form wrapper using `useActionState` / `useFormStatus`. |
| `app/page.tsx` | Public landing page. |
| `app/signin/`, `app/signup/` | Auth pages (redirect to `/dashboard` if already signed in). |
| `app/dashboard/page.tsx` | **Auth-guarded** (`if (!session?.user) redirect("/signin")`). |
| `app/dashboard/recommender.tsx` | Client component: pick foods → recommendations, computed client-side. |
| `lib/db.ts` | `@vercel/postgres` helpers + idempotent `ensureSchema()` (creates `users`). |
| `lib/herbs.ts` | Food→herb rules. `recommendHerbs(foodIds, freeText)` is pure & shared. |

## Access model

- `/`, `/signin`, `/signup` are public.
- `/dashboard` (the recommender) requires a signed-in app account.
- Sessions are JWT cookies; sign out via the dashboard button (`logout` action).

## Environment variables

| Var | Where | Notes |
| --- | --- | --- |
| `AUTH_SECRET` | required | Signs session JWTs. Generate: `openssl rand -base64 33`. Set locally in `.env.local`; set in Vercel for all envs. |
| `POSTGRES_URL` (+ friends) | required for auth | Injected automatically by the Vercel Postgres store. Locally: `vercel env pull .env.local`. |

`.env.local` is gitignored; `.env.example` documents the shape and is committed.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + type check
```

Signup/signin need a `POSTGRES_URL`; without one the landing/auth pages render
but account creation returns a graceful "database not configured" error.

## Deploy (Vercel)

- Project: `matthew-newhooks-projects/herbaceous`, repo `newhook/herbaceous`.
- GitHub is connected → **pushes to `main` auto-deploy**. Manual: `vercel --prod`.
- Postgres is provisioned via the dashboard **Storage** tab (Marketplace/Neon),
  which injects the `POSTGRES_*` vars. The `users` table self-creates on first signup.
- **Deployment Protection**: if the public URL returns `401` with a
  `_vercel_sso_nonce` cookie, Vercel Authentication is on — disable it under
  Settings → Deployment Protection to make the app publicly reachable.
