import { getAuthContext } from '@/features/auth/server/queries';
import { WorkspaceDetailMain } from '@/features/workspaces';

const WorkspaceIdPage = async () => {
  await getAuthContext();


  return (
    <div className="flex flex-col gap-y-4">
      <WorkspaceDetailMain />
    </div>
  );
};

export default WorkspaceIdPage;
