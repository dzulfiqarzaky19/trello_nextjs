import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IWorkspaceDetail } from '../schema';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface MembersListProps {
  workspace: IWorkspaceDetail;
}

export const MembersList = ({ workspace }: MembersListProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-bold">Workspace Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage access levels and roles for this workspace.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {workspace.members.map((member) => (
          <div
            key={member.user_id}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.profiles?.avatar_url || ''} />
                <AvatarFallback>
                  {member.profiles?.full_name?.charAt(0) || 'M'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-x-2">
                  <p className="text-sm font-medium">
                    {member.profiles?.full_name || 'Unknown Member'}
                  </p>
                  {workspace.user?.id === member.user_id && (
                    <span className="text-xs text-muted-foreground">(You)</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {member.profiles?.email || 'No email'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              {member.role === 'ADMIN' && (
                <Badge variant="secondary">WORKSPACE ADMIN</Badge>
              )}
              {member.role === 'MEMBER' && (
                <Badge
                  variant="outline"
                  className="text-blue-500 bg-blue-50 border-blue-200"
                >
                  MEMBER
                </Badge>
              )}
            </div>
          </div>
        ))}
        <div className="p-4 text-center">
          <Button variant="link" size="sm" className="text-muted-foreground">
            View all {workspace.members.length} members
          </Button>
        </div>
      </div>
    </div>
  );
};
