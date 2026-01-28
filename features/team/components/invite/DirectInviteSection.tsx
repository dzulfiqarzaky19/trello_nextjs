'use client';

import { useState } from 'react';
import { useAddMember } from '@/features/members/api/useAddMember';
import { UserSearchInput } from '@/features/users/components/UserSearchInput';
import { IUserSearchResult } from '@/features/users/schema';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface DirectInviteSectionProps {
  workspaceId: string;
  workspaceName: string;
  existingMemberIds: string[];
}

export const DirectInviteSection = ({
  workspaceId,
  workspaceName,
  existingMemberIds,
}: DirectInviteSectionProps) => {
  const [selectedUser, setSelectedUser] = useState<IUserSearchResult | null>(
    null
  );
  const addMember = useAddMember();

  const handleSelectUser = (user: IUserSearchResult) => {
    setSelectedUser(user);
  };

  const handleConfirmAdd = () => {
    if (!selectedUser) return;
    addMember.mutate(
      {
        json: { workspaceId, userId: selectedUser.id },
        workspaceId,
      },
      {
        onSuccess: () => {
          setSelectedUser(null);
          toast.success(
            `Added ${selectedUser.full_name || selectedUser.email} to ${workspaceName}`
          );
        },
      }
    );
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="space-y-2">
        <label className="text-sm font-medium">Add Existing User</label>
        <UserSearchInput
          onSelect={handleSelectUser}
          excludeIds={existingMemberIds}
          placeholder="Search by email or name..."
        />
      </div>

      {selectedUser && (
        <div className="flex items-center justify-between gap-3 p-3 bg-muted rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedUser.avatar_url || ''} />
              <AvatarFallback>
                {selectedUser.full_name?.charAt(0) ||
                  selectedUser.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {selectedUser.full_name || 'Unknown User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {selectedUser.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmAdd}
              disabled={addMember.isPending}
            >
              {addMember.isPending ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
