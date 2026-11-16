begin;

alter table public.site_content
  drop constraint if exists site_content_content_type_check;
alter table public.site_content
  add constraint site_content_content_type_check
  check (content_type in ('internship_track', 'announcement', 'page_copy', 'service', 'case_study', 'footer_details'));

insert into public.site_content (slug, content_type, title, summary, badge, content, sort_order, is_published)
values (
  'footer-details',
  'footer_details',
  'Footer details',
  'Public contact, location, social, and legal information shown in the site footer.',
  'Site footer',
  '{"description":"A modern software house delivering custom SaaS platforms, AI chatbots, mobile applications, and cloud architecture for businesses worldwide.","proofPoints":["100% Code Ownership","Clean Architecture","Agile Sprints"],"linkedinUrl":"https://www.linkedin.com/company/devatrix-technologies/","instagramUrl":"https://www.instagram.com/devatrix_technologies?srtk=aHNrM2N2ZGF2OHY5","whatsappNumber":"923156179410","whatsappLabel":"+92 315 6179410 (WhatsApp)","officeCity":"Lahore, Pakistan","officeDescription":"Software Engineering & Operations","remoteTitle":"Remote-First Delivery","remoteDescription":"Serving Clients Worldwide","contactEmail":"devatrixtechnologies@gmail.com","legalName":"Devatrix Technologies LLC","copyrightText":"All rights reserved."}'::jsonb,
  90,
  true
)
on conflict (slug) do nothing;

commit;
