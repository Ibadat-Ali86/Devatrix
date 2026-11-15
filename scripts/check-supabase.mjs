import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error } = await supabase.from('internship_applications').select('id').limit(0);

if (error) {
  console.error('Supabase check failed. Confirm the project URL, server key, and migration.');
  console.error(`Error code: ${error.code || 'unknown'}`);
  process.exit(1);
}

console.log('Supabase connection and internship application table are accessible.');
