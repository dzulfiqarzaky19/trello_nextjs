import 'server-only';

import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function getAuthContext() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/sign-in');
  }

  return { user, profile, supabase };
}
