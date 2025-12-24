import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Checking env vars...');
if (!url || !key) {
  console.error(
    'Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
  console.log('URL:', url ? 'Set' : 'Missing');
  console.log('Key:', key ? 'Set' : 'Missing');
  process.exit(1);
}
console.log('Env vars found.');

const supabase = createClient(url, key);

async function verify() {
  console.log('Connecting to Supabase...');
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Connection Failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    process.exit(1);
  }

  console.log('Connection Successful! Supabase is reachable.');
  console.log(`Profiles table exists. Current count: ${count}`);
}

verify();
