-- Existing submissions remain valid. New application code supplies the reference.
begin;

alter table public.internship_applications
  add column tracking_code text,
  add constraint internship_tracking_code_format
    check (tracking_code is null or (
      tracking_code ~ '^[A-Z0-9]{6}$'
      and tracking_code ~ '[A-Z]'
      and tracking_code ~ '[0-9]'
    )),
  add constraint internship_tracking_code_unique unique (tracking_code);

commit;
