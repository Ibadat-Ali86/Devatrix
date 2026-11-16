# Portal onboarding and project submissions

Status reviewed: 2026-11-16. This guide describes the implementation on the `codex/intern-portal-experience` feature branch. A feature-branch push does not mean the changes have been merged or deployed.

## Current behavior

### Internship application and learner identity

1. When an internship application is accepted by the intake API, the application is stored in Supabase and receives a unique six-character `tracking_code` containing letters and digits. The code belongs to that application; each internship enrollment has its own `enrollment_code`.
2. The application intake creates or reuses one Supabase Auth account per normalized email address. New accounts get a cryptographically random bootstrap password that the app never returns, logs, stores as readable text, emails, or displays to admins.
3. Multiple applications can belong to the same Auth account. Accepting an application activates that application's portal access and creates the relevant enrollment and milestones. Portal access is still checked server-side.
4. Admins can see an application's email and tracking ID in the protected review workspace. An admin cannot retrieve the Auth password. Passwords are stored and verified by Supabase Auth.

### Sending portal access

The **Send portal setup email** action is available only for an accepted internship application with active portal access. The protected API rechecks those conditions and matches the Supabase Auth identity to the application's email before sending.

- For an unconfirmed Auth email, the server generates a single-use Supabase magic-link token and sends the applicant a link to verify their email and choose a password. The raw token is included only in the applicant email link, placed in its URL fragment so it is not sent in the initial page request, and is not returned to the admin browser or stored in the audit table.
- The setup page waits for the applicant to select **Verify email and continue** before consuming the one-time token. This reduces the chance that an automated email-link scanner consumes it first.
- The learner chooses and confirms a password of at least 12 characters. The password is submitted directly to the server setup endpoint and Supabase Auth; the application does not persist the password as readable text.
- For an already confirmed account, the email contains the application tracking ID and portal sign-in link. The learner uses their existing password.
- The email contains the selected application's tracking ID. It does not contain a generated or reusable password.

Email delivery is disabled unless `ADMIN_EMAIL_SENDING_ENABLED=true`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` are configured. The endpoint checks admin authorization, application status, active access, recipient identity, idempotency, and delivery limits. `admin_response_log` records the recipient, admin, template, provider message ID, and delivery state; it does not store message bodies or setup tokens.

### Public GitHub repository requirement

Milestone work accepts a repository hosted at `https://github.com/{owner}/{repository}` only when GitHub's official repository API confirms it is public. The portal validates on blur and again on submit. The milestone API performs its own final check before writing the submission, so client-side validation is not the authorization boundary.

- A private, missing, or inaccessible repository is rejected with a message asking the learner to check the URL and make the repository public.
- A malformed or non-GitHub URL is rejected with an example of the accepted format.
- GitHub rate limits, timeouts, and network/API failures are treated as temporary verification failures; the submission is not saved and the learner is asked to retry.
- The API calls a fixed `api.github.com` endpoint and does not fetch the learner-supplied URL itself.

### Loader

Page-level loading uses the official Devatrix logo in a centered navy panel over a restrained translucent, blurred backdrop. The overlay accounts for mobile safe areas, uses viewport-height fallbacks, and disables motion under `prefers-reduced-motion`. Application-submission loading remains inline.

## Implementation map

| Area | Files |
| --- | --- |
| GitHub URL parsing and public-repository lookup | `src/lib/portal/github-repository.ts` |
| Learner check endpoint | `src/app/api/portal/milestones/validate/route.ts` |
| Final milestone submission guard | `src/app/api/portal/milestones/route.ts` |
| Learner field and feedback | `src/app/portal/PortalDashboard.tsx` |
| Admin portal email action | `src/app/admin/AdminConsole.tsx`, `src/app/api/admin/applications/portal-access/route.ts` |
| Single-use token verification and session setup | `src/app/portal/set-password/`, `src/app/api/portal/setup/session/route.ts` |
| Learner password update | `src/app/api/portal/setup/password/route.ts` |
| Centered brand loader | `src/components/BrandLoader.tsx`, `src/app/globals.css` |
| Portal email audit-template constraint | `supabase/migrations/20261116150503_admin_portal_setup_email.sql` |

## Supabase setup: leaked-password protection

Supabase Auth can reject passwords found in known breach lists through its leaked-password protection setting. Supabase documents this option as available on the Pro plan and above. The Devatrix project's security advisor previously reported this setting as disabled; the application cannot enable this hosted Auth setting through a database migration.

To enable it manually:

1. Sign in to the Supabase Dashboard and open the Devatrix development project.
2. In the project sidebar, open **Authentication**.
3. Open **Sign In / Providers**, then select the **Email** provider.
4. In the password/security settings, enable **Prevent use of leaked passwords** (the wording may appear as leaked-password protection).
5. Save the setting.
6. If the toggle is unavailable, confirm the project's Supabase plan. Supabase currently lists this feature for Pro and above; enabling it may require a paid plan. Do not upgrade the plan without reviewing its price and obtaining approval.
7. Verify the setting in the Supabase Auth security/advisor view. Then test password setup using a synthetic account and a unique password that is not a known breached password.

Supabase's password security documentation: <https://supabase.com/docs/guides/auth/password-security>.

The app currently enforces a minimum of 12 characters in its own password setup route. Leaked-password rejection is an additional Supabase Auth check and must be enabled in the project dashboard to take effect.

## Database and environment state

- Migration `20261116150503_admin_portal_setup_email.sql` extends the allowed `admin_response_log.template` values with `portal_setup`.
- The migration is applied to the connected **development** Supabase project (`oletzhhipeswedbwwmzi`). The development database reports the `portal_setup` constraint value. This is not evidence that production has the migration.
- Do not apply migrations to production until the target project and its migration history have been checked and the deployment is separately authorized.
- Required server variables include `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and server-only `SUPABASE_SECRET_KEY`. Admin access also requires the confirmed administrator email in `ADMIN_EMAILS`.
- For email testing, configure `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `ADMIN_EMAIL_SENDING_ENABLED=true` only in the environment where the test is intended. Never commit or share secret values.

## Verification record and boundaries

Local checks previously passed: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `git diff --check`. Local browser validation accepted a public repository and rejected an unavailable repository with the expected user guidance. The browser check did not submit a milestone or an application.

The implementation has not been verified by sending a real setup email or completing an authenticated password-setup flow. No email was sent while implementing this feature, and no applicant record was changed for verification. A feature-branch push is not equivalent to merging or production deployment. Before enabling email for applicants, test with a synthetic account and an address controlled by the project owner.

## Remaining work

- Enable Supabase leaked-password protection if the project plan supports it, then verify the Auth setting.
- Configure and verify a Resend sender in the intended environment; test the one-time setup email with a controlled synthetic applicant.
- Complete a non-destructive end-to-end flow: apply, review, accept, send setup email, verify email, set password, sign in, and confirm that the learner sees only their own programs.
- Complete responsive visual review of the learner setup page, portal, admin action, and loading overlay on desktop, tablet, and mobile.
- Review migration history before any production rollout; the development migration state does not automatically transfer to production.
- The 24-hour onboarding scheduler, private résumé storage, payment-provider integration, and certificate issuance workflow remain separate future work.
- Merge into a default branch and deploy only after separate review and explicit authorization.
