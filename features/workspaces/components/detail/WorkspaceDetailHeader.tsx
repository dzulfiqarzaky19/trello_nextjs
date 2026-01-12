import { useGetWorkspace } from '../../api/useGetWorkspace';
import { HeaderSkeleton } from '@/components/skeleton/HeaderSkeleton';

export const WorkspaceDetailHeader = () => {
  const { data, isLoading, error } = useGetWorkspace();

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  if (error || !data) {
    return null;
  }

  const workspace = data.data;

  return (
    <div>
      <h1 className="text-2xl font-bold">{workspace.name}</h1>

      <p className="text-muted-foreground">
        Manage workspace projects, settings, and team members.
      </p>
    </div>
  );
};
