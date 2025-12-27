import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { WorkspaceCreate } from './WorkspaceCreate';
import { Users } from 'lucide-react';
import { IGetWorkspace } from '../schema';

interface IWorkspaceListProps {
  workspaces?: IGetWorkspace;
}

export const WorkspaceList = ({ workspaces }: IWorkspaceListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {workspaces &&
        workspaces.map((workspace) => (
          <Link key={workspace.id} href={`/workspaces/${workspace.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-32 relative overflow-hidden group">
              {workspace.image_url && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundImage: `url(${workspace.image_url})` }}
                />
              )}
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg">{workspace.name}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{workspace.members.length || 0} members</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

      <WorkspaceCreate />
    </div>
  );
};
