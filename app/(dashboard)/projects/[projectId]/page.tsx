import { Header } from '@/components/header/Header';
import { ProjectDetail } from '@/features/projects/components/detail/ProjectDetail';
import { getAuthContext } from '@/features/auth/server/queries';

interface ProjectDetailPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  await getAuthContext();

  const { projectId } = await params;

  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        isProjectsPage
        label="Project"
        description="Manage tasks, track progress, and collaborate with your team"
        boardId={projectId}
      />

      <ProjectDetail />
    </div>
  );
}
