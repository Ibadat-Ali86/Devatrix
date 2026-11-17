begin;

-- 1. Lightweight offer letter & cohort reminder tracking columns on internship_applications
alter table public.internship_applications
  add column if not exists offer_letter_sent_at timestamptz,
  add column if not exists offer_letter_count integer not null default 0,
  add column if not exists reminder_sent_at timestamptz,
  add column if not exists reminder_count integer not null default 0;

-- Partial index only covers pending queue items (near-zero storage overhead)
create index if not exists idx_internship_offer_queue
  on public.internship_applications (created_at)
  where offer_letter_sent_at is null;

-- 2. Singleton Cohort & Onboarding Automation Settings
create table if not exists public.cohort_settings (
  singleton boolean primary key default true check (singleton = true),
  batch_start_date text not null default '1st December 2026',
  batch_end_date text not null default '12th January 2027',
  whatsapp_group_url text not null default 'https://wa.me/923156179410',
  reminder_start_date date,
  reminder_hour_pkt integer not null default 17 check (reminder_hour_pkt >= 0 and reminder_hour_pkt <= 23),
  auto_send_24h_enabled boolean not null default false,
  auto_reminder_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.cohort_settings (singleton, batch_start_date, batch_end_date, reminder_hour_pkt)
values (true, '1st December 2026', '12th January 2027', 17)
on conflict (singleton) do nothing;

alter table public.cohort_settings enable row level security;
revoke all on table public.cohort_settings from public, anon, authenticated;
grant select, insert, update on table public.cohort_settings to service_role;

-- 3. Contact & Project Estimator Lead Capture Table
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('contact', 'estimator')),
  full_name text not null,
  email text not null,
  company text,
  service text,
  budget text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_inquiries_created_at
  on public.contact_inquiries (created_at desc);

alter table public.contact_inquiries enable row level security;
revoke all on table public.contact_inquiries from public, anon, authenticated;
grant select, insert, update on table public.contact_inquiries to service_role;

commit;
