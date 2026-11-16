-- Admin review, response auditing, and a small published-content CMS.
-- Applicant tables and CMS data remain inaccessible to public Supabase roles.
begin;

alter table public.internship_applications
  add column if not exists admin_review_notes text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

alter table public.career_applications
  add column if not exists admin_review_notes text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists internship_applications_status_created_idx
  on public.internship_applications (status, created_at desc);

create index if not exists career_applications_status_created_idx
  on public.career_applications (status, created_at desc);

create table public.admin_response_log (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  application_kind text not null check (application_kind in ('internship', 'career')),
  application_id uuid not null,
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  admin_email text not null,
  recipient_email text not null,
  template text not null check (template in ('received', 'shortlisted', 'not_selected', 'hired')),
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'sent', 'failed')),
  provider_message_id text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index admin_response_log_admin_created_idx
  on public.admin_response_log (admin_user_id, created_at desc);
create index admin_response_log_recipient_created_idx
  on public.admin_response_log (recipient_email, created_at desc);

alter table public.admin_response_log enable row level security;
revoke all on table public.admin_response_log from public, anon, authenticated;

create table public.site_content (
  slug text primary key check (slug ~ '^[a-z0-9-]{1,80}$'),
  content_type text not null check (content_type in ('internship_track', 'announcement')),
  title text not null,
  summary text not null default '',
  badge text not null default '',
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  is_published boolean not null default false,
  sort_order integer not null default 0,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_content_public_order_idx
  on public.site_content (content_type, is_published, sort_order);

alter table public.site_content enable row level security;
revoke all on table public.site_content from public, anon, authenticated;

insert into public.site_content (slug, content_type, title, summary, badge, sort_order, is_published)
values
  ('web-fullstack', 'internship_track', 'Frontend & Full-Stack Web Engineering', 'Learn to build high-performance web applications using modern React, Next.js, TypeScript, and real API integrations.', 'Next.js & React 19', 10, true),
  ('ai-agents', 'internship_track', 'Applied AI & Agent Engineering', 'Build and evaluate a focused LLM application with grounded answers, bounded tool use, and a tested service.', 'LLM Apps, RAG & Evaluation', 20, true),
  ('data-science', 'internship_track', 'Machine Learning & Data Science', 'Take a supervised learning problem from data quality and baselines through validation, error analysis, and a reproducible report.', 'Python, Statistics & ML', 30, true),
  ('data-analytics', 'internship_track', 'Data Analytics & Business Intelligence', 'Query and model data, define clear KPIs, build a usable Power BI report, and explain findings.', 'SQL, Power BI & KPI Reporting', 40, true),
  ('ai-fde', 'internship_track', 'AI Engineer & Forward Deployed Engineer (FDE)', 'Build a bounded AI solution around a real workflow: discover requirements, integrate APIs and data, evaluate behavior, and deploy a documented pilot.', 'Applied AI Delivery', 50, true),
  ('react-native', 'internship_track', 'React Native Mobile App Development', 'Develop high-performance cross-platform mobile apps for iOS and Android using React Native, TypeScript, Expo, and modern state management.', 'iOS & Android (Expo & CLI)', 60, true),
  ('flutter', 'internship_track', 'Flutter Mobile App Development', 'Build beautiful, natively compiled multi-platform applications from a single codebase using Flutter, Dart, Provider/Bloc, and Firebase.', 'Dart & Material UI', 70, true),
  ('site-announcement', 'announcement', 'Site announcement', '', '', 0, false)
on conflict (slug) do nothing;

commit;
