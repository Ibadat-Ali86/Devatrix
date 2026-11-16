begin;

-- Admin acceptance opens the access link and creates an enrollment atomically.
create function public.accept_internship_application(
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
  select * into application_row
  from public.internship_applications
  where id = p_application_id
  for update;
  if not found then
    raise exception 'Application not found' using errcode = 'P0002';
  end if;

  select access.user_id into v_access_user_id
  from public.intern_portal_access access
  where access.application_id = p_application_id;
  if v_access_user_id is null then
    raise exception 'Application account link is unavailable' using errcode = 'P0001';
  end if;

  select content.slug into v_track_slug
  from public.site_content content
  where content.content_type = 'internship_track'
    and content.is_published
    and content.title = application_row.track;
  if v_track_slug is null then
    raise exception 'The application track is not currently published' using errcode = 'P0001';
  end if;

  select * into enrollment_row
  from public.internship_enrollments enrollment
  where enrollment.user_id = v_access_user_id and enrollment.track_slug = v_track_slug;
  if not found then
    begin
      select * into enrollment_row
      from public.register_internship_enrollment(
        v_access_user_id, v_track_slug, p_enrollment_code, p_started_at,
        p_expected_end_at, p_milestones
      );
    exception when unique_violation then
      select * into enrollment_row
      from public.internship_enrollments enrollment
      where enrollment.user_id = v_access_user_id and enrollment.track_slug = v_track_slug;
      if not found then raise; end if;
    end;
  end if;

  update public.internship_applications
  set status = 'accepted',
      admin_review_notes = case when p_admin_notes is null then admin_review_notes else nullif(btrim(p_admin_notes), '') end,
      reviewed_at = now(), reviewed_by = p_reviewer_id, updated_at = now()
  where id = p_application_id;

  update public.intern_portal_access
  set is_active = true
  where user_id = v_access_user_id and application_id = p_application_id;
  if not found then
    raise exception 'Application access could not be activated' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'application_id', p_application_id,
    'status', 'accepted',
    'enrollment_id', enrollment_row.id,
    'enrollment_code', enrollment_row.enrollment_code,
    'track_slug', enrollment_row.track_slug
  );
end;
$$;
revoke all on function public.accept_internship_application(uuid, uuid, text, timestamptz, timestamptz, jsonb, text) from public, anon, authenticated;
grant execute on function public.accept_internship_application(uuid, uuid, text, timestamptz, timestamptz, jsonb, text) to service_role;

commit;
