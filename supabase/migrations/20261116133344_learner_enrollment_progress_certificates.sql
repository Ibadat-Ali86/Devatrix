begin;

-- A learner owns one enrollment per published track. Applications remain
-- application records; these rows model participation and progress.
create table public.internship_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_slug text not null references public.site_content(slug) on update cascade,
  source_application_id uuid references public.internship_applications(id) on delete set null,
  enrollment_code text not null unique check (enrollment_code ~ '^[A-Z0-9]{6}$'),
  status text not null default 'active' check (status in ('active', 'completed', 'paused', 'withdrawn')),
  started_at timestamptz not null default now(),
  expected_end_at timestamptz not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, track_slug),
  check (expected_end_at > started_at),
  check ((status = 'completed') = (completed_at is not null))
);

create index internship_enrollments_user_created_idx
  on public.internship_enrollments (user_id, created_at desc);
create index internship_enrollments_track_idx
  on public.internship_enrollments (track_slug, status);

create table public.internship_milestones (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.internship_enrollments(id) on delete cascade,
  week_number smallint not null check (week_number between 1 and 6),
  title text not null,
  instructions text not null,
  due_at timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'in_progress', 'submitted', 'revision_requested', 'completed')),
  submission_url text,
  learner_notes text,
  reviewer_feedback text,
  reviewed_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, week_number),
  check (submission_url is null or submission_url ~ '^https?://')
);
create index internship_milestones_enrollment_due_idx
  on public.internship_milestones (enrollment_id, due_at);
create index internship_milestones_review_queue_idx
  on public.internship_milestones (status, submitted_at)
  where status in ('submitted', 'revision_requested');

create table public.certificate_requests (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.internship_enrollments(id) on delete cascade,
  certificate_type text not null check (certificate_type in ('simple', 'premium')),
  status text not null default 'requested' check (status in ('requested', 'payment_pending', 'paid', 'issued', 'rejected')),
  fee_amount numeric(12,2),
  currency text,
  payment_reference text,
  requested_at timestamptz not null default now(),
  payment_verified_at timestamptz,
  payment_verified_by uuid references auth.users(id) on delete set null,
  issued_at timestamptz,
  issued_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (enrollment_id, certificate_type),
  check (fee_amount is null or fee_amount >= 0),
  check (currency is null or currency ~ '^[A-Z]{3}$'),
  check ((status in ('paid', 'issued')) = (payment_verified_at is not null)),
  check ((status = 'issued') = (issued_at is not null))
);
create index certificate_requests_status_idx on public.certificate_requests (status, requested_at desc);

-- Fees and signatory configuration are deliberately unset until the owner
-- chooses prices, currency, and an approved signer identity.
create table public.certificate_settings (
  singleton boolean primary key default true check (singleton),
  simple_fee numeric(12,2),
  premium_fee numeric(12,2),
  currency text,
  payment_instructions text not null default '',
  signatory_name text not null default '',
  signatory_title text not null default 'Authorized Signatory',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  check (simple_fee is null or simple_fee >= 0),
  check (premium_fee is null or premium_fee >= 0),
  check (currency is null or currency ~ '^[A-Z]{3}$')
);
insert into public.certificate_settings (singleton) values (true) on conflict do nothing;

-- Create six dated checkpoints for new enrollments. The initial curriculum
-- milestones are operational placeholders; administrators can publish the
-- per-track requirements before a learner cohort begins.
create function public.seed_enrollment_milestones()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  milestone_titles text[] := array[
    'Environment setup and learning plan',
    'Core concepts and first working deliverable',
    'Feature implementation and evidence',
    'Integration, quality checks, and feedback',
    'Capstone build and deployment preparation',
    'Final demonstration and handover'
  ];
  milestone_instructions text[] := array[
    'Review the track brief, prepare your development environment, and share a short plan with your first small proof of setup.',
    'Complete the first core learning objective and submit a concise explanation with a link to your working deliverable.',
    'Build the next track deliverable, keep the work in version control, and describe one issue you solved.',
    'Connect the parts of your project, run relevant checks, and submit the result with any feedback questions.',
    'Prepare your capstone for review. Include setup instructions, test evidence, and any known limitations.',
    'Present the completed project, summarize what you learned, and provide a clean handover or portfolio link.'
  ];
  i integer;
begin
  for i in 1..6 loop
    insert into public.internship_milestones (enrollment_id, week_number, title, instructions, due_at)
    values (
      new.id,
      i,
      milestone_titles[i],
      milestone_instructions[i],
      new.started_at + make_interval(days => i * 7)
    );
  end loop;
  return new;
end;
$$;
create trigger internship_enrollment_seed_milestones
  after insert on public.internship_enrollments
  for each row execute function public.seed_enrollment_milestones();

-- Preserve currently active portal access by creating one enrollment for each
-- active linked application whose track exists in the published CMS catalogue.
insert into public.internship_enrollments (
  user_id, track_slug, source_application_id, enrollment_code, started_at, expected_end_at
)
select distinct on (access.user_id, content.slug)
  access.user_id,
  content.slug,
  application.id,
  upper(substr(translate(gen_random_uuid()::text, '-', ''), 1, 6)),
  greatest(application.created_at, now()),
  greatest(application.created_at, now()) + interval '42 days'
from public.intern_portal_access access
join public.internship_applications application on application.id = access.application_id
join public.site_content content
  on content.content_type = 'internship_track'
  and content.is_published
  and content.title = application.track
where access.is_active
order by access.user_id, content.slug, application.created_at desc
on conflict (user_id, track_slug) do nothing;

alter table public.internship_enrollments enable row level security;
alter table public.internship_milestones enable row level security;
alter table public.certificate_requests enable row level security;
alter table public.certificate_settings enable row level security;

revoke all on public.internship_enrollments, public.internship_milestones,
  public.certificate_requests, public.certificate_settings from public, anon;
revoke insert, update, delete on public.internship_enrollments,
  public.internship_milestones, public.certificate_requests, public.certificate_settings from authenticated;
grant select on public.internship_enrollments, public.internship_milestones, public.certificate_requests to authenticated;
grant all on public.internship_enrollments, public.internship_milestones,
  public.certificate_requests, public.certificate_settings to service_role;

create policy "Learners read their enrollments"
  on public.internship_enrollments for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Learners read milestones for their enrollments"
  on public.internship_milestones for select to authenticated
  using (exists (
    select 1 from public.internship_enrollments enrollment
    where enrollment.id = enrollment_id and enrollment.user_id = (select auth.uid())
  ));
create policy "Learners read certificate requests for their enrollments"
  on public.certificate_requests for select to authenticated
  using (exists (
    select 1 from public.internship_enrollments enrollment
    where enrollment.id = enrollment_id and enrollment.user_id = (select auth.uid())
  ));

commit;
