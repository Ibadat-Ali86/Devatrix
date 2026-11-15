-- Apply to the development project only after confirming the target in the dashboard.
-- Application data is accessible only to trusted server-side code for now.
begin;

create table public.internship_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  university text not null,
  track text not null,
  duration text not null,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  resume_url text,
  statement text,
  status text not null default 'under_review',
  created_at timestamptz not null default now()
);

alter table public.internship_applications enable row level security;
revoke all on table public.internship_applications from public, anon, authenticated;

commit;
