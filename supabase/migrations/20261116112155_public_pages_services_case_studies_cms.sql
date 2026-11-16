begin;

alter table public.site_content
  drop constraint if exists site_content_content_type_check;
alter table public.site_content
  add constraint site_content_content_type_check
  check (content_type in ('internship_track', 'announcement', 'page_copy', 'service', 'case_study'));

insert into public.site_content (slug, content_type, title, summary, badge, sort_order, is_published)
values
  ('home-hero', 'page_copy', 'Software Solutions That Create', 'A modern engineering studio delivering custom web, mobile, cloud architectures, and practical AI solutions with an uncompromising focus on quality, reliability, and client success.', 'Real Value', 1, true),
  ('about-hero', 'page_copy', 'Engineering Digital Solutions', 'Devatrix Technologies was founded on a simple principle: build reliable, high-performance software that solves real business problems.', 'That Create Real Value.', 2, true),
  ('services-hero', 'page_copy', 'Enterprise Software Services.', 'From mission-critical distributed architectures to modern cloud platforms and practical enterprise AI integration.', 'Engineered for Scale.', 3, true),
  ('work-hero', 'page_copy', 'Production software that', 'Explore engineering examples across SaaS, applied AI, real-time operations, and digital commerce.', 'moves business forward.', 4, true),
  ('service-custom-software', 'service', 'Custom Software Engineering', 'We design and build bespoke software tailored to solve complex operational challenges. Our architectures prioritize modularity, horizontal scalability, and zero downtime.', 'High-Performance Systems & Microservices', 10, true),
  ('service-cloud-devops', 'service', 'Enterprise Cloud & DevOps', 'Accelerate software delivery with automated CI/CD, infrastructure as code, and production cloud platforms.', 'Resilient Multi-Cloud Architecture', 20, true),
  ('service-ai-ml', 'service', 'AI & Machine Learning Solutions', 'Turn business data into useful products with carefully scoped AI integrations, retrieval pipelines, and predictive models.', 'Pragmatic Intelligence for Real ROI', 30, true),
  ('service-web-mobile', 'service', 'Web & Mobile Applications', 'Deliver fluid digital experiences across web, iOS, and Android with dependable APIs and maintainable product architecture.', 'Modern Cross-Platform Products', 40, true),
  ('case-study-saas', 'case_study', 'Multi-Tenant SaaS Platform & Subscription Engine', 'Engineered a modern full-stack multi-tenant SaaS application with automated billing, granular role-based permissions, and real-time webhook synchronization.', 'Modern Web & Cloud SaaS', 50, true),
  ('case-study-ai', 'case_study', 'AI Knowledge Base & Intelligent Document Assistant', 'Built an intelligent document ingestion pipeline that indexes unstructured contracts and technical manuals for semantic search and grounded question answering.', 'Applied AI & Semantic Search', 60, true),
  ('case-study-telemetry', 'case_study', 'Real-Time Operational Telemetry & Dispatch Console', 'Developed a responsive operations console with field dispatch tracking, map telemetry, and instant notifications through bi-directional WebSockets.', 'Real-Time Systems & WebSockets', 70, true),
  ('case-study-commerce', 'case_study', 'Headless E-Commerce & Real-Time Inventory Engine', 'Designed a headless commerce experience with live inventory synchronization and a resilient order processing workflow.', 'Digital Commerce & Retail', 80, true)
on conflict (slug) do nothing;

commit;
