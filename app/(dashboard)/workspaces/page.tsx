import { Header } from '@/components/header/Header';
import { getAuthContext } from '@/features/auth/server/queries';
import { WorkspaceLoadingSkeleton } from '@/features/workspaces/components/WorkspaceLoadingSkeleton';
import dynamic from 'next/dynamic';

const WorkspaceMain = dynamic(
  () =>
    import('@/features/workspaces/components/WorkspaceMain').then(
      (mod) => mod.WorkspaceMain
    ),
  {
    loading: () => <WorkspaceLoadingSkeleton />,
  }
);

export default async function WorkspacesPage() {
  await getAuthContext();

  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        label="My Workspaces"
        description="Manage your workspaces and collaborate with your team"
      />

      <WorkspaceMain />
    </div>
  );
}
