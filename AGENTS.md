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
- Admin application search and exports share submission-date filters for all time, the last 24 hours, 7 days, or 30 days. CSV includes all current application-table columns and is capped at 10,000 matching rows.
- The internships catalogue includes a six-week DevOps Engineer & Cloud Infrastructure track. Its curriculum and outcomes are code-managed; the CMS manages its public title, description, badge, and publication state.
- Internship applications have a private six-character tracking code, visible to authorized admins in overview, desktop/mobile lists, and application review. Career applications use a separate application ID and do not have internship tracking codes.
- The CMS edits public page introductions, service summaries, case-study cards, internship track copy/publication, the internships announcement, and footer details (contact, social, location, trust statements, and legal text). Footer fields are validated by the admin API and served through the public CMS endpoint. Curriculum details, technical tags/metrics, deliverables, layout, and other static page content remain code-managed.
- Applicant response templates use the Resend API only when explicitly configured; sending is disabled by default. The 24-hour onboarding scheduler does not exist yet.
- Internship portal identities and per-application tracking codes are created at application intake. Admins can send portal access only after accepting an application activates its access record. The email includes that application's tracking code and, when the Auth email is still unconfirmed, a single-use email verification link followed by learner-chosen password setup. Existing confirmed accounts receive a portal sign-in link. Plaintext passwords are never stored, returned, or shown to admins. Audit rows use `admin_response_log.template = 'portal_setup'`.
- Learner milestone submissions accept only public `github.com/{owner}/{repository}` repositories. The portal checks public visibility in the UI and repeats that check server-side before saving. GitHub 404 results are reported as unverifiable/private-or-invalid; rate limits and network failures are reported as temporary verification errors.
- The full-page loader is a fixed, centered Devatrix-branded overlay with a restrained blurred backdrop, responsive safe-area spacing, and reduced-motion support. Application loaders remain inline.
- Additive admin/CMS migrations through `20261116124410_admin_footer_content_cms.sql` have been applied to the development Supabase project. Verify deployment/database migration state before any production use.
- Résumé uploads/private file storage are deferred. Current applicant forms accept optional résumé URLs; the dashboard can open valid web URLs only.
- The `codex/intern-portal-experience` phase adds learner enrollments, track-specific six-week milestones, private learner progress, certificate previews/requests, and an admin learner-program workspace. It is published to both repository remotes but is not deployed.
- One normalized-email Supabase Auth account can own multiple applications and one enrollment per track. `internship_applications.tracking_code` identifies an application; `internship_enrollments.enrollment_code` identifies a track enrollment. Neither code authenticates users.
- `internship_applications.track_slug` stores the stable CMS track identity alongside the submitted title so later title edits do not break acceptance/enrollment mapping.
- Admin acceptance of an internship application now atomically marks that application accepted, activates its portal access link, and creates the learner's enrollment and six track-specific milestones. The same learner can receive more accepted tracks under the existing account.
- Learner portal routes are under `src/app/portal/`; learner APIs are under `src/app/api/portal/`. The protected admin learner program and API are `src/app/admin/learners/` and `src/app/api/admin/learners/`. Track milestone templates are in `src/lib/portal/milestone-templates.ts`.
- Enrollment, milestone, certificate-request, and certificate-setting schemas are in the additive migrations `20261116133344_learner_enrollment_progress_certificates.sql`, `20261116134644_track_specific_enrollment_curriculum.sql`, `20261116135354_accept_application_creates_enrollment.sql`, `20261116135622_store_internship_track_slug.sql`, and `20261116140046_backfill_track_curriculum_milestones.sql`. These were applied to the development Supabase project only.
- Migration `20261116150503_admin_portal_setup_email.sql` extends the admin email audit template constraint for portal setup messages. It has been applied to the development Supabase project only; do not assume it has been applied to production.
- Certificate previews require portal sign-in and all six milestones approved by an admin. Simple/Premium differ only in format; merit recognition is separate. Fee, currency, payment instructions, and approved signer name are configurable in admin and unset by default. Payment verification and issuance are manual statuses; no payment provider, checkout, or signed certificate artifact is integrated.

### Implementation map

- Admin UI: `src/app/admin/`.
- Protected admin handlers: `src/app/api/admin/`.
- Server-side authorization and Supabase access: `src/lib/admin/server.ts`.
- CMS data access and public content endpoint: `src/lib/content/server.ts` and `src/app/api/public/content/route.ts`.
- CMS and review schema/content: `supabase/migrations/20261116110054_devatrix_admin_cms.sql` through `supabase/migrations/20261116130919_add_devops_engineering_internship_track.sql`.
- Setup and configuration details: `docs/ADMIN_WORKSPACE_SETUP.md`.
- Portal onboarding, public repository validation, leaked-password protection, migration state, and verification limits: `docs/PORTAL_ONBOARDING_AND_SUBMISSIONS.md`.

### Pending before wider release

- Set `SUPABASE_PUBLISHABLE_KEY` and `ADMIN_EMAILS` in the local environment using the confirmed Supabase Auth email; never inspect, print, commit, or share environment-file values.
- Configure the same required variables in the intended Vercel environment before a separately authorized deployment.
- Run a non-destructive end-to-end acceptance/enrollment flow with a dedicated synthetic account, then complete responsive visual checks on desktop, tablet, and mobile. The current local visual review showed the admin learner workspace, but did not mutate an applicant record or test learner authentication.
- Configure a verified Resend sender and test with an address controlled by the project owner before enabling applicant response emails. Keep `ADMIN_EMAIL_SENDING_ENABLED` false until that test is approved.
- Supabase leaked-password protection was reported disabled by the security advisor. Enable and verify it in the Auth dashboard before wider release; Supabase currently requires the Pro plan or higher for this feature. See `docs/PORTAL_ONBOARDING_AND_SUBMISSIONS.md`.
- Remaining phases: the 24-hour onboarding scheduler/email, private résumé Storage, payment-provider checkout/verification, and any certificate signature/artifact workflow.
- Review and merge the stacked PRs in order (#1, #2, #3, #4), then review the portal phase against #4 before merging it. Do not push, merge, or deploy additional changes without explicit user authorization.

### Local review

- Start with `npm run dev`; the local site uses port 3000 by default. Admin sign-in is `/admin/sign-in` and the protected workspace is `/admin`.
- For the current branch, lint, TypeScript, and production build have passed. Re-run the relevant checks after code changes; a successful route HTTP response alone does not verify authenticated admin access.
