'use client';

import { Button } from '@/components/ui/button';
import { MembersListSkeleton } from './MembersListSkeleton';
import { AddMemberDialog } from './AddMemberDialog';
import { useGetMembers } from '../api/useGetMembers';
import { MemberItem } from './MemberItem';

export const MembersList = () => {
  const { data, isLoading, error } = useGetMembers();

  if (isLoading) {
    return <MembersListSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Failed to load members
      </div>
    );
  }

  const { members, isAdmin, currentUserId, workspaceId } = data.data;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-bold">Workspace Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage access levels and roles for this workspace.
          </p>
        </div>

        {isAdmin && <AddMemberDialog />}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {members.map((member) => (
          <MemberItem
            key={member.user_id}
            member={member}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
            workspaceId={workspaceId}
          />
        ))}

        {members.length > 5 && (
          <div className="p-4 text-center">
            <Button variant="link" size="sm" className="text-muted-foreground">
              View all {members.length} members
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
