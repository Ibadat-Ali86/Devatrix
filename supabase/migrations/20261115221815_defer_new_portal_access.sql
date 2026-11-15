-- New application links stay inactive until a later trusted onboarding flow.
alter table public.intern_portal_access alter column is_active set default false;
