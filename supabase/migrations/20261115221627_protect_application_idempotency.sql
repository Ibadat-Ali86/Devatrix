-- A retry is accepted only when it contains the original application's data.
create or replace function public.register_internship_application(p_user_id uuid, p_application jsonb)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_application_id uuid := (p_application ->> 'id')::uuid;
  inserted_id uuid;
begin
  if not exists (select 1 from public.intern_accounts account where account.user_id = p_user_id and account.email = p_application ->> 'email') then
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
    insert into public.intern_portal_access (user_id, application_id) values (p_user_id, inserted_id);
    return 'created';
  end if;

  if exists (
    select 1 from public.intern_portal_access access
    join public.internship_applications app on app.id = access.application_id
    where access.user_id = p_user_id and app.id = v_application_id
      and app.full_name is not distinct from p_application ->> 'full_name'
      and app.email is not distinct from p_application ->> 'email'
      and app.whatsapp is not distinct from p_application ->> 'whatsapp'
      and app.university is not distinct from p_application ->> 'university'
      and app.track is not distinct from p_application ->> 'track'
      and app.duration is not distinct from p_application ->> 'duration'
      and app.github_url is not distinct from p_application ->> 'github_url'
      and app.linkedin_url is not distinct from p_application ->> 'linkedin_url'
      and app.portfolio_url is not distinct from p_application ->> 'portfolio_url'
      and app.resume_url is not distinct from p_application ->> 'resume_url'
      and app.statement is not distinct from p_application ->> 'statement'
  ) then return 'existing'; end if;

  raise exception 'Submission conflicts with an earlier request' using errcode = 'P0002';
end;
$$;
revoke all on function public.register_internship_application(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.register_internship_application(uuid, jsonb) to service_role;
