begin;

alter table public.internship_applications
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null;

alter table public.career_applications
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null;

create index if not exists internship_applications_reviewed_by_idx
  on public.internship_applications (reviewed_by);

create index if not exists career_applications_reviewed_by_idx
  on public.career_applications (reviewed_by);

commit;
