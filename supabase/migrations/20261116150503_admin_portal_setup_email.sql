-- Add an audited template for an admin-triggered learner password setup email.
-- The email contains a single-use Supabase Auth link, never a stored password.
begin;

alter table public.admin_response_log
  drop constraint if exists admin_response_log_template_check;

alter table public.admin_response_log
  add constraint admin_response_log_template_check
  check (template in ('received', 'shortlisted', 'not_selected', 'hired', 'portal_setup'));

commit;
