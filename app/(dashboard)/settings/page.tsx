import { Header } from '@/components/header/Header';
import { SettingsMain } from '@/features/settings/SettingsMain';
import { SETTINGS_PAGE_HEADER } from '@/lib/const/settingsPage';
import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
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

  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        label={SETTINGS_PAGE_HEADER.label}
        description={SETTINGS_PAGE_HEADER.description}
      />

      <SettingsMain profile={profile} userEmail={user.email} />
    </div>
  );
}
