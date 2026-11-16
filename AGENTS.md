<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Devatrix project handoff (2026-11-16)

Use this section as the current implementation snapshot. Update it when the feature phase changes; do not replace the generated Next.js instructions above.

### Completed in the current branch stack

- PR #1 (`codex/devatrix-frontend-supabase`): connected internship application intake to Supabase.
- PR #2 (`codex/internship-tracking-portal`): added internship tracking and applicant portal foundations.
- PR #3 (`codex/supabase-security-foundation`, based on PR #2): hardened intake and portal credential handling.
- PR #4 (`codex/admin-dashboard-cms`, based on PR #3): added the admin workspace and public content CMS. All four PRs are for review; do not assume they are merged.
- Admin authentication uses Supabase Auth plus the server-side `ADMIN_EMAILS` allowlist. Keep service credentials server-only. There is no public admin registration.
- Admin application review includes search, status filters and updates, private review notes, reviewer/time tracking, and formula-safe filtered CSV export.
- The CMS edits public page introductions, service summaries, case-study cards, internship track copy/publication, and the internships announcement. Curriculum details, technical tags/metrics, deliverables, layout, and other static page content remain code-managed.
- Applicant response templates use the Resend API only when explicitly configured; sending is disabled by default. No 24-hour scheduler or password-setup email flow exists yet.
- Additive admin/CMS migrations have been applied to the development Supabase project. Verify deployment/database migration state before any production use.
- Résumé uploads/private file storage are deferred. Current applicant forms accept optional résumé URLs; the dashboard can open valid web URLs only.

### Implementation map

- Admin UI: `src/app/admin/`.
- Protected admin handlers: `src/app/api/admin/`.
- Server-side authorization and Supabase access: `src/lib/admin/server.ts`.
- CMS data access and public content endpoint: `src/lib/content/server.ts` and `src/app/api/public/content/route.ts`.
- CMS and review schema: `supabase/migrations/20261116110054_devatrix_admin_cms.sql` through `20261116113109_admin_review_actor_tracking.sql`.
- Setup and configuration details: `docs/ADMIN_WORKSPACE_SETUP.md`.

### Pending before wider release

- Set `SUPABASE_PUBLISHABLE_KEY` and `ADMIN_EMAILS` in the local environment using the confirmed Supabase Auth email; never inspect, print, commit, or share environment-file values.
- Configure the same required variables in the intended Vercel environment before a separately authorized deployment.
- Verify admin sign-in and review workflows locally, then perform responsive visual checks for the dashboard on desktop, tablet, and mobile.
- Configure a verified Resend sender and test with an address controlled by the project owner before enabling applicant response emails. Keep `ADMIN_EMAIL_SENDING_ENABLED` false until that test is approved.
- Implement later phases separately: private résumé Storage, the scheduled 24-hour response/password-setup flow, and any expanded portal/admin capabilities.
- Review and merge the stacked PRs in order (#1, #2, #3, #4). Do not push, merge, or deploy additional changes without explicit user authorization.

### Local review

- Start with `npm run dev`; the local site uses port 3000 by default. Admin sign-in is `/admin/sign-in` and the protected workspace is `/admin`.
- For the current branch, lint, TypeScript, and production build have passed. Re-run the relevant checks after code changes; a successful route HTTP response alone does not verify authenticated admin access.
