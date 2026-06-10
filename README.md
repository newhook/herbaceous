# 🌿 Herbaceous

A small Next.js demo that recommends herbs to plant in your garden based on the
foods you like to eat. Includes email/password **signup & signin** backed by
Vercel Postgres and Auth.js.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Auth.js (NextAuth v5)** — credentials provider, JWT sessions
- **@vercel/postgres** — user storage (`users` table auto-created on first use)
- **bcryptjs** — password hashing
- Rule-based recommendation engine in [`lib/herbs.ts`](lib/herbs.ts)

## How it works

| Path | What it does |
| --- | --- |
| `/` | Landing page |
| `/signup` | Create an account (name, email, password ≥ 8 chars) |
| `/signin` | Sign in |
| `/dashboard` | Auth-guarded. Pick foods → get herb recommendations |

Signup hashes the password, stores the user, and signs them in. The dashboard is
protected server-side via `auth()` and redirects unauthenticated users to
`/signin`. Recommendations are computed from your selected foods and an optional
free-text note (no external API calls).

## Local development

```bash
npm install
npm run dev
```

You need two environment variables (see `.env.example`):

- `AUTH_SECRET` — already set in `.env.local` for local dev. Generate a new one
  with `openssl rand -base64 33`.
- `POSTGRES_URL` — a Postgres connection string. **Signup/signin won't work
  without it.** The easiest way to get one locally:

  ```bash
  npm i -g vercel
  vercel link                  # link to a Vercel project
  vercel env pull .env.local   # pulls POSTGRES_URL (after adding a Postgres store)
  ```

The landing page and the auth-redirect work without a database; only account
creation/login touch Postgres.

## Deploy to Vercel

1. **Push to GitHub** (or use the `vercel` CLI directly).
2. **Import the project** at [vercel.com/new](https://vercel.com/new).
3. **Add a Postgres store**: Project → *Storage* → *Create Database* →
   *Postgres* (Neon). Vercel injects `POSTGRES_URL` (and friends) automatically.
4. **Add the auth secret**: Project → *Settings* → *Environment Variables* →
   add `AUTH_SECRET` (run `openssl rand -base64 33` for a value).
5. **Deploy.** The `users` table is created automatically on first signup.

Or from the CLI:

```bash
npm i -g vercel
vercel              # first deploy / link
vercel env add AUTH_SECRET
vercel --prod       # production deploy
```

> Note: `trustHost: true` is set in `auth.ts` so Auth.js works on Vercel's
> generated domains out of the box.
