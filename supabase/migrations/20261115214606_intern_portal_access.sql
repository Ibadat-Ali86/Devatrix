begin;

-- Only trusted administrators can provision an account-to-application link.
create table public.intern_portal_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  application_id uuid not null unique references public.internship_applications(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.intern_portal_access enable row level security;
revoke all on public.intern_portal_access from public, anon, authenticated;
grant select (user_id, application_id, is_active) on public.intern_portal_access to authenticated;

create policy "Interns can read their own active portal access"
  on public.intern_portal_access for select to authenticated
  using (user_id = (select auth.uid()) and is_active = true);

-- Limit the portal to the minimum application fields and enforce ownership in the database.
grant select (id, full_name, track, status) on public.internship_applications to authenticated;
create policy "Interns can read their linked application"
  on public.internship_applications for select to authenticated
  using (exists (
    select 1 from public.intern_portal_access access
    where access.application_id = internship_applications.id
      and access.user_id = (select auth.uid())
      and access.is_active = true
  ));

commit;
