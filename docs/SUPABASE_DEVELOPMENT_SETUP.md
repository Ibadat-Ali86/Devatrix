# Supabase development setup

Use a development project without real applicant data for this setup. Internship applications are stored in Supabase; career applications use their existing storage. Résumé file uploads for internships are deferred, while résumé links remain optional.

1. In the Supabase dashboard, open the development project and select **SQL Editor**.
2. For a new database, copy the contents of `supabase/migrations/20261115000000_internship_applications.sql` into a new query and run it once. Verify the project name before running it. The script creates an empty table and denies direct access to the public client roles. The existing development project already has this table, created through the SQL Editor; it is not recorded in Supabase migration history, so do not run this script there again.
3. In the project directory, create `.env.local` (or edit it if it exists):

   ```dotenv
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SECRET_KEY=your-server-only-secret-key
   ```

   Find the URL in **Connect** and the secret key in **Settings → API Keys**. Never share the secret or commit `.env.local`. The secret key bypasses row level security; do not expose it to browsers or prefix it with `NEXT_PUBLIC_`.
4. Run `node --env-file=.env.local scripts/check-supabase.mjs`. A successful check confirms that the server key can reach the table; it does not create an application or test the form.

To reverse this setup, first ensure that no application data needs to be retained. An administrator can then drop `public.internship_applications` from the development project and remove the local environment variables. Dropping a table deletes all rows permanently.
