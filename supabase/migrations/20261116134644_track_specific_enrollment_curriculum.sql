begin;

-- Enrollments and their six track-specific milestones are committed atomically.
create function public.register_internship_enrollment(
  p_user_id uuid,
  p_track_slug text,
  p_enrollment_code text,
  p_started_at timestamptz,
  p_expected_end_at timestamptz,
  p_milestones jsonb
)
returns public.internship_enrollments
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved public.internship_enrollments;
  updated_count integer;
begin
  if not exists (
    select 1 from public.site_content content
    where content.slug = p_track_slug
      and content.content_type = 'internship_track'
      and content.is_published
  ) then
    raise exception 'Internship track is not open for enrollment' using errcode = 'P0001';
  end if;
  if jsonb_typeof(p_milestones) <> 'array' or jsonb_array_length(p_milestones) <> 6 then
    raise exception 'Exactly six milestones are required' using errcode = '22023';
  end if;
  if (select count(distinct week_number) from jsonb_to_recordset(p_milestones) as item(week_number smallint, title text, instructions text)) <> 6
     or exists (
       select 1 from jsonb_to_recordset(p_milestones) as item(week_number smallint, title text, instructions text)
       where week_number not between 1 and 6 or length(btrim(title)) not between 3 and 120 or length(btrim(instructions)) not between 10 and 1200
     ) then
    raise exception 'Milestone content is invalid' using errcode = '22023';
  end if;

  insert into public.internship_enrollments (
    user_id, track_slug, enrollment_code, started_at, expected_end_at
  ) values (
    p_user_id, p_track_slug, p_enrollment_code, p_started_at, p_expected_end_at
  ) returning * into saved;

  update public.internship_milestones milestone
  set title = item.title, instructions = item.instructions, updated_at = now()
  from jsonb_to_recordset(p_milestones) as item(week_number smallint, title text, instructions text)
  where milestone.enrollment_id = saved.id and milestone.week_number = item.week_number;
  get diagnostics updated_count = row_count;
  if updated_count <> 6 then
    raise exception 'Milestones could not be initialized' using errcode = 'P0001';
  end if;
  return saved;
end;
$$;
revoke all on function public.register_internship_enrollment(uuid, text, text, timestamptz, timestamptz, jsonb) from public, anon, authenticated;
grant execute on function public.register_internship_enrollment(uuid, text, text, timestamptz, timestamptz, jsonb) to service_role;

commit;
