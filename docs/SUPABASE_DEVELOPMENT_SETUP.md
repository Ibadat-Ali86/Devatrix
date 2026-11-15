# Supabase development setup

Use a development project without real applicant data for this setup. Internship applications are stored in Supabase; career applications use their existing storage. Résumé file uploads for internships are deferred, while résumé links remain optional.

1. In the Supabase dashboard, open the development project and select **SQL Editor**.
2. For a new database, copy the contents of `supabase/migrations/20261115000000_internship_applications.sql` into a new query and run it once. Verify the project name before running it. The script creates an empty table and denies direct access to the public client roles. The existing development project already has this table, created through the SQL Editor; it is not recorded in Supabase migration history, so do not run this script there again.
   Apply `supabase/migrations/20261115213548_internship_tracking_reference.sql` after the table script on a new database. This additive change has already been applied through SQL Editor to the existing development project and is not recorded in its migration history; do not run it there again. Existing rows can have no reference; each new submission creates a unique six-character reference, kept private and never used as an authentication credential.
3. In the project directory, create `.env.local` (or edit it if it exists):

   ```dotenv
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SECRET_KEY=your-server-only-secret-key
   SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   Find the URL in **Connect** and the keys in **Settings → API Keys**. The portal uses the publishable key with user sessions and row-level security; the internship intake uses the server-only secret key. Never share the secret or commit `.env.local`. The secret key bypasses row level security; do not expose it to browsers or prefix it with `NEXT_PUBLIC_`.
4. Run `node --env-file=.env.local scripts/check-supabase.mjs`. A successful check confirms that the server key can reach the table; it does not create an application or test the form.

For a new database, apply `supabase/migrations/20261115214606_intern_portal_access.sql`, `supabase/migrations/20261115221047_applicant_account_provisioning.sql`, `supabase/migrations/20261115221627_protect_application_idempotency.sql`, and `supabase/migrations/20261115221815_defer_new_portal_access.sql` after the first two migrations. The first three scripts were applied through SQL Editor to the current development project and are not recorded in its migration history. The later three migrations were applied and recorded using the Supabase plugin. Do not rerun any of these against that project; reconcile migration history before using automated migration commands.

Each successful internship submission reserves or reuses one account per normalized email, creates an unconfirmed Supabase Auth user if necessary, and atomically records the application and its access link. New application links start inactive and cannot access the portal until a future trusted onboarding process activates them. Each application has its own private tracking reference; a retry with the same submission ID and unchanged data does not create another application. A changed retry is rejected so it cannot silently overwrite or discard changes. A randomly generated bootstrap password is sent only to Supabase Auth, which stores a password hash; the application never retains or displays the password. A user must later verify their email and set a password before signing in. No invitation, password-setup flow, automated email, or 24-hour scheduler is implemented yet.

The server-controlled `intern_accounts` reservation table has RLS enabled, no client grants, and no public access policies. Supabase's security advisor may report this deliberate deny-by-default arrangement as informational. Authenticated users can read only their active application links and the linked applications' name, track, and status. The current portal shows the most recently linked active application; the broader portal experience is not finalized.

If account creation fails, an account reservation may remain without a linked application; it can be retried by another submission using the same email. An existing unrelated Supabase Auth user is not automatically linked or modified, and requires a future verified account-linking procedure. A process failure after a successful Auth call can likewise leave a reservation for later reconciliation. Before real usage, add intake abuse protection, monitoring and a reconciliation process for incomplete reservations.

The development integration check `DEVATRIX_PORTAL_TEST=1 node --env-file=.env.local tests/portal-integration.mjs` creates temporary confirmed test users and application records, tests authorization, and removes those records. Run it only after verifying the target is a dedicated development project, with the local application running. It does not send invitations.

The related check `DEVATRIX_PROVISIONING_TEST=1 node --env-file=.env.local tests/internship-provisioning.integration.mjs` creates and removes synthetic accounts and applications in the same way; it does not send invitations. Both commands require `SUPABASE_PUBLISHABLE_KEY` in the environment.

To reverse this setup, first ensure that no application data needs to be retained. An administrator can then drop `public.internship_applications` from the development project and remove the local environment variables. Dropping a table deletes all rows permanently.
