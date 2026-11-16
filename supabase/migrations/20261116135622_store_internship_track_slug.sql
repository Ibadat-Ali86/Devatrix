begin;

alter table public.internship_applications
  add column track_slug text references public.site_content(slug) on update cascade on delete restrict;
create index internship_applications_track_slug_idx on public.internship_applications (track_slug);

update public.internship_applications application
set track_slug = content.slug
from public.site_content content
where content.content_type = 'internship_track'
  and content.title = application.track
  and application.track_slug is null;

create or replace function public.register_internship_application(p_user_id uuid, p_application jsonb)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_application_id uuid := (p_application ->> 'id')::uuid;
  v_track_slug text := nullif(p_application ->> 'track_slug', '');
  inserted_id uuid;
begin
  if not exists (
    select 1 from public.intern_accounts account
    where account.user_id = p_user_id and account.email = p_application ->> 'email'
  ) then
    raise exception 'Applicant account is unavailable' using errcode = 'P0001';
  end if;
  if v_track_slug is not null and not exists (
    select 1 from public.site_content content
    where content.slug = v_track_slug and content.content_type = 'internship_track' and content.is_published
  ) then
    raise exception 'Internship track is not open for applications' using errcode = 'P0001';
  end if;

  insert into public.internship_applications (
    id, full_name, email, whatsapp, university, track, duration, github_url,
    linkedin_url, portfolio_url, resume_url, statement, created_at, tracking_code, track_slug
  ) values (
    v_application_id, p_application ->> 'full_name', p_application ->> 'email',
    p_application ->> 'whatsapp', p_application ->> 'university', p_application ->> 'track',
    p_application ->> 'duration', p_application ->> 'github_url', p_application ->> 'linkedin_url',
    p_application ->> 'portfolio_url', p_application ->> 'resume_url', p_application ->> 'statement',
    (p_application ->> 'created_at')::timestamptz, p_application ->> 'tracking_code', v_track_slug
  ) on conflict (id) do nothing returning id into inserted_id;

  if inserted_id is not null then
    insert into public.intern_portal_access (user_id, application_id) values (p_user_id, inserted_id);
    return 'created';
  end if;
  if exists (select 1 from public.intern_portal_access access where access.user_id = p_user_id and access.application_id = v_application_id) then
    return 'existing';
  end if;
  raise exception 'Application reference is unavailable' using errcode = 'P0001';
end;
$$;
revoke all on function public.register_internship_application(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.register_internship_application(uuid, jsonb) to service_role;

create or replace function public.accept_internship_application(
  p_application_id uuid,
  p_reviewer_id uuid,
  p_enrollment_code text,
  p_started_at timestamptz,
  p_expected_end_at timestamptz,
  p_milestones jsonb,
  p_admin_notes text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  application_row public.internship_applications;
  v_access_user_id uuid;
  v_track_slug text;
  enrollment_row public.internship_enrollments;
begin
  select * into application_row from public.internship_applications where id = p_application_id for update;
  if not found then raise exception 'Application not found' using errcode = 'P0002'; end if;
  select access.user_id into v_access_user_id from public.intern_portal_access access where access.application_id = p_application_id;
  if v_access_user_id is null then raise exception 'Application account link is unavailable' using errcode = 'P0001'; end if;

  v_track_slug := application_row.track_slug;
  if v_track_slug is null then
    select content.slug into v_track_slug from public.site_content content
    where content.content_type = 'internship_track' and content.is_published and content.title = application_row.track;
  end if;
  if v_track_slug is null or not exists (
    select 1 from public.site_content content where content.slug = v_track_slug and content.content_type = 'internship_track' and content.is_published
  ) then raise exception 'The application track is not currently published' using errcode = 'P0001'; end if;

  select * into enrollment_row from public.internship_enrollments enrollment
  where enrollment.user_id = v_access_user_id and enrollment.track_slug = v_track_slug;
  if not found then
    begin
      select * into enrollment_row from public.register_internship_enrollment(
        v_access_user_id, v_track_slug, p_enrollment_code, p_started_at, p_expected_end_at, p_milestones
      );
    exception when unique_violation then
      select * into enrollment_row from public.internship_enrollments enrollment
      where enrollment.user_id = v_access_user_id and enrollment.track_slug = v_track_slug;
      if not found then raise; end if;
    end;
  end if;

  update public.internship_applications
  set status = 'accepted',
      admin_review_notes = case when p_admin_notes is null then admin_review_notes else nullif(btrim(p_admin_notes), '') end,
      reviewed_at = now(), reviewed_by = p_reviewer_id, updated_at = now()
  where id = p_application_id;
  update public.intern_portal_access set is_active = true where user_id = v_access_user_id and application_id = p_application_id;
  if not found then raise exception 'Application access could not be activated' using errcode = 'P0001'; end if;

  return jsonb_build_object('application_id', p_application_id, 'status', 'accepted', 'enrollment_id', enrollment_row.id, 'enrollment_code', enrollment_row.enrollment_code, 'track_slug', enrollment_row.track_slug);
end;
$$;
revoke all on function public.accept_internship_application(uuid, uuid, text, timestamptz, timestamptz, jsonb, text) from public, anon, authenticated;
grant execute on function public.accept_internship_application(uuid, uuid, text, timestamptz, timestamptz, jsonb, text) to service_role;

commit;
