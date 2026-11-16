# Devatrix admin workspace setup

The admin workspace is available at `/admin`. It uses the existing Supabase Auth password sign-in, then checks the confirmed account email against a server-side allowlist on every protected page and API request. There is no public admin sign-up. The service key stays server-side; applicant and CMS tables keep RLS enabled with no direct client policies.

## Required configuration

Set these variables in the deployment environment and in your local environment file. Do not send the file or its values in chat.

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-server-only-secret-key
ADMIN_EMAILS=your-confirmed-supabase-auth-email@example.com
```

Use the email address of the confirmed Supabase Auth account you already control. `ADMIN_EMAILS` accepts comma-separated addresses if you intentionally authorize more administrators. Do not create a public registration route or put the secret key in a `NEXT_PUBLIC_` variable.

After setting variables locally, restart `npm run dev`. In Vercel, set them for the environments you intend to use and create a deployment when you are ready; this repository change does not deploy the app.

## Application review

The dashboard lists internship and career submissions, supports search/status filters, private review notes, records the last reviewer and decision time, and provides CSV exports (up to 10,000 rows per export). Internship applications display the six-character tracking ID in the overview, desktop table, mobile cards, and review detail. Career applications use a separate application ID; they do not receive internship tracking codes. CSV fields are formula-escaped. Exports contain personal data; store them privately and delete local copies when no longer needed.

Résumé uploads remain deferred. The current forms accept optional résumé URLs only. Admins can open a valid HTTP/HTTPS URL in a new tab; uploaded CV files and private Storage previews are not supported yet.

## Email responses

Email sending is disabled by default. To enable it, configure a Resend API key, a sender address on a verified Resend domain, and set:

```dotenv
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Devatrix Technologies <applications@your-verified-domain.example>
ADMIN_EMAIL_SENDING_ENABLED=true
```

Only then does **Send response** send the selected template immediately. The API records the recipient, administrator, template, provider message ID, and delivery status; it does not store message bodies. Idempotency keys prevent duplicate delivery on request retries, and delivery is rate-limited. Test this with an address you control before enabling real applicant mail. The 24-hour scheduler and password setup emails remain separate future work.

## Public content CMS

The CMS edits homepage/About/Services/Work introductions, service summaries, case-study cards, internship track titles/descriptions/badges, publication state, an optional announcement displayed on the internships page, and public footer details (brand description, trust statements, social links, WhatsApp, email, location, and legal line). Those fields are connected to the public pages and update without a code release. Footer values are validated by the admin API and served through the public CMS endpoint. Detailed curricula, case-study metrics and technical tags, service deliverables, layout, and remaining static page content stay in code.

## Database change

The additive migrations `20261116110054_devatrix_admin_cms.sql` through `20261116124410_admin_footer_content_cms.sql` add private review fields, the admin response audit table, the RLS-protected content table, indexes, seeded public content, and a footer settings record. They do not modify or delete applicant rows. The footer CMS migration is applied to the development Supabase project; verify the migration state before production use.
