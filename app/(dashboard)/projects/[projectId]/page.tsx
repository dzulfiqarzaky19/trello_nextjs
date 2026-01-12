import { Header } from '@/components/header/Header';
import { ProjectDetail } from '@/features/projects/components/detail/ProjectDetail';
import { getAuthContext } from '@/features/auth/server/queries';

export default async function ProjectDetailPage() {
  await getAuthContext();


  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        isProjectsPage
        label="Project"
        description="Manage tasks, track progress, and collaborate with your team"
      />

      <ProjectDetail />
    </div>
  );
}
