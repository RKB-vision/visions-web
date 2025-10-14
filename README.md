# Visions Web - AI Projects & Tools

A professional blog platform for showcasing AI projects and tools, featuring an Apple-inspired design aesthetic.

## Installation & Setup

- Prereqs: Node.js 18+, npm.
- Install: `npm install`
- Env:
  - `AUTH_SECRET` (or `NEXTAUTH_SECRET`)
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - (Optional) `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` if client Supabase is used.
- Migrations: Apply SQL in `supabase/migrations/001_init_surveys_profiles.sql` to your Supabase project.
- Dev: `npm run dev` then visit `http://localhost:5000`.

## Features & Usage

- Authentication: Sign in at `/auth/signin` (default test accounts in this README).
- Dashboard: `/dashboard` integrates Welcome, Chat, Calendar.
- Routing: `/blog`, `/explore`, `/about` pages enabled.
- Surveys:
  - Users submit feedback at `/surveys` (stored in Supabase).
  - Admin views, filters, and exports at `/admin` → “Survey Responses”.
- Avatars:
  - Users upload avatars in `/profile` (signed URL upload via Supabase storage).
  - Stored path saved to `profiles` table.

## Supabase Configuration

- Create project and set env vars in `.env.local`.
- Run the migration SQL.
- Storage bucket `avatars` is auto-created by API route; keep it private.
- RLS enabled; APIs use service role and NextAuth roles for secure access.

## Troubleshooting

- 404s on `/blog`, `/explore`, `/about`:
  - Ensure pages exist and navigation points to the correct paths.
- Supabase errors:
  - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
  - Check that migrations ran successfully.
- Avatar uploads fail:
  - Confirm bucket exists and keys are correct.
  - Ensure content-type matches the file type.

## Connect

<a href="https://twitter.com/yourprofile" target="_blank" rel="noopener">
  <img src="public/vercel.svg" alt="Twitter" width="28" style="vertical-align:middle; margin-right:8px;" />
</a>
<a href="https://github.com/yourprofile" target="_blank" rel="noopener">
  <img src="public/next.svg" alt="GitHub" width="28" style="vertical-align:middle; margin-right:8px;" />
</a>
<a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener">
  <img src="public/globe.svg" alt="LinkedIn" width="28" style="vertical-align:middle; margin-right:8px;" />
</a>

## Default Test Accounts
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## Tech Stack
Next.js, TypeScript, Tailwind CSS, NextAuth.js, Supabase
