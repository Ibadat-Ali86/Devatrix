begin;

-- A server-controlled reservation makes concurrent submissions for one email
-- converge on one Auth user, including after a transient provisioning failure.
create table public.intern_accounts (
  user_id uuid primary key,
  email text not null unique check (email = lower(btrim(email))),
  created_at timestamptz not null default now()
);
alter table public.intern_accounts enable row level security;
revoke all on public.intern_accounts from public, anon, authenticated;
grant all on public.intern_accounts to service_role;

-- An account can have multiple applications; each application has one owner.
alter table public.intern_portal_access
  drop constraint intern_portal_access_pkey,
  add constraint intern_portal_access_pkey primary key (user_id, application_id);
grant select (created_at) on public.intern_portal_access to authenticated;

-- The application and its access link must be committed together. The function
-- runs with the caller's privileges and is callable only by the server role.
create function public.register_internship_application(p_user_id uuid, p_application jsonb)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_application_id uuid := (p_application ->> 'id')::uuid;
  inserted_id uuid;
begin
  if not exists (
    select 1 from public.intern_accounts account
    where account.user_id = p_user_id and account.email = p_application ->> 'email'
  ) then
    raise exception 'Applicant account is unavailable' using errcode = 'P0001';
  end if;

  insert into public.internship_applications (
    id, full_name, email, whatsapp, university, track, duration, github_url,
    linkedin_url, portfolio_url, resume_url, statement, created_at, tracking_code
  ) values (
    v_application_id, p_application ->> 'full_name', p_application ->> 'email',
    p_application ->> 'whatsapp', p_application ->> 'university', p_application ->> 'track',
    p_application ->> 'duration', p_application ->> 'github_url', p_application ->> 'linkedin_url',
    p_application ->> 'portfolio_url', p_application ->> 'resume_url', p_application ->> 'statement',
    (p_application ->> 'created_at')::timestamptz, p_application ->> 'tracking_code'
  ) on conflict (id) do nothing returning id into inserted_id;

  if inserted_id is not null then
    insert into public.intern_portal_access (user_id, application_id)
    values (p_user_id, inserted_id);
    return 'created';
  end if;

  if exists (select 1 from public.intern_portal_access access
             where access.user_id = p_user_id and access.application_id = v_application_id) then
    return 'existing';
  end if;
  raise exception 'Application reference is unavailable' using errcode = 'P0001';
end;
$$;
revoke all on function public.register_internship_application(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.register_internship_application(uuid, jsonb) to service_role;

commit;
