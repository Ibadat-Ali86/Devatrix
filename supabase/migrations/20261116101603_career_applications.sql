-- Career applicant data is written only by trusted server-side code.
begin;

create table public.career_applications (
  id uuid primary key default gen_random_uuid(),
  application_id text not null unique,
  full_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  role text not null,
  experience text,
  previous_company text,
  previous_salary text,
  expected_salary text,
  notice_period text,
  linkedin_url text,
  github_url text,
  resume_url text,
  cover_note text,
  status text not null default 'review_pending'
    check (status in ('review_pending', 'in_review', 'shortlisted', 'rejected', 'hired')),
  created_at timestamptz not null default now()
);

create index career_applications_created_at_idx on public.career_applications (created_at desc);
create index career_applications_email_idx on public.career_applications (email);

alter table public.career_applications enable row level security;
revoke all on table public.career_applications from public, anon, authenticated;

commit;
