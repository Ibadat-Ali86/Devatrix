-- Rename Frontend & Full-Stack Web Engineering -> Full-Stack Web Development
-- and align summaries & badges for web-fullstack, react-native, and flutter with the 6-week syllabus.

update public.site_content
set
  title = 'Full-Stack Web Development',
  summary = 'Build and deploy a production full-stack web application using React 19, Next.js App Router, TypeScript, REST APIs, database persistence, and authentication.',
  badge = 'Next.js, React & PostgreSQL',
  updated_at = now()
where content_type = 'internship_track'
  and slug = 'web-fullstack';

update public.site_content
set
  summary = 'Engineer cross-platform iOS and Android applications using React Native, TypeScript, Expo, modern state management, offline storage, and release builds.',
  badge = 'iOS & Android (Expo & TypeScript)',
  updated_at = now()
where content_type = 'internship_track'
  and slug = 'react-native';

update public.site_content
set
  summary = 'Build natively compiled cross-platform mobile apps from a single codebase using Flutter, Dart, Provider or BLoC state architecture, REST APIs, and Firebase.',
  badge = 'Dart, Material 3 & Firebase',
  updated_at = now()
where content_type = 'internship_track'
  and slug = 'flutter';
