import { Header } from '@/components/header/Header';
import { BoardList } from '@/features/projects/components/BoardList';
import { getBoards } from '@/features/projects/actions';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { boards } = await getBoards();

  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        label="My Projects"
        description="Manage your boards and collaborate with your team"
      />

      <BoardList boards={boards} />
    </div>
  );
}
