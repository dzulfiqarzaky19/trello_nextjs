import { Header } from '@/components/header/Header';
import { PublicProfile } from '@/features/profile/components/PublicProfile';
import { createSupabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  // Fetch the profile of the requested user
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !profile) {
    notFound();
  }

  return (
    <div className="min-h-screen font-sans bg-zinc-50 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        label="Member Profile"
        description={`Viewing profile of ${profile.full_name || 'User'}`}
      />

      <main className="p-8 max-w-4xl mx-auto w-full">
        <PublicProfile profile={profile} />
      </main>
    </div>
  );
}
