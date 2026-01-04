import { Header } from '@/components/header/Header';
import { ProjectsMain } from '@/features/projects/ProjectsMain';
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params;

  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        isProjectsPage
        label="Project"
        description="Manage tasks, track progress, and collaborate with your team"
        boardId={id}
      />

      <ProjectsMain projectId={id} />
    </div>
  );
}
