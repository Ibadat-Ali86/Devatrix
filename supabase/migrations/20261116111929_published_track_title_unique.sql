create unique index if not exists site_content_published_track_title_unique
  on public.site_content (lower(title))
  where content_type = 'internship_track' and is_published;
