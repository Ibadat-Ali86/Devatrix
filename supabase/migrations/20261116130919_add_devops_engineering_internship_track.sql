begin;

insert into public.site_content (slug, content_type, title, summary, badge, sort_order, is_published)
values (
  'devops-engineering',
  'internship_track',
  'DevOps Engineer & Cloud Infrastructure',
  'Build a practical delivery pipeline: strengthen Linux and Git foundations, containerize an application, automate CI/CD, provision cloud infrastructure with Terraform, and deploy a monitored capstone.',
  'Linux, Docker, CI/CD & Terraform',
  80,
  true
)
on conflict (slug) do nothing;

commit;
