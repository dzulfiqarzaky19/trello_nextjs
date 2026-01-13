'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserSearchInput } from '@/features/users/components/UserSearchInput';
import { IUserSearchResult } from '@/features/users/schema';
import { useAddMember } from '../api/useAddMember';

import { useGetMembers } from '../api/useGetMembers';

interface AddMemberFormProps {
  closeModal?: () => void;
}

export const AddMemberForm = ({ closeModal }: AddMemberFormProps) => {
  const { data: membersData } = useGetMembers();
  const existingMemberIds = membersData?.data?.members.map((m) => m.user_id);
  const workspaceId = membersData?.data.workspaceId;

  if (!workspaceId) {
    console.warn('AddMemberForm: No workspaceId available');
    return null;
  }
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
      { workspaceId, userId: selectedUser.id },
      {
        onSuccess: () => {
          setSelectedUser(null);
          closeModal?.();
        },
      }
    );
  };

  const handleCancel = () => {
    setSelectedUser(null);
  };

  if (selectedUser) {
    return (
      <>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to add this user to the workspace?
          </p>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser.avatar_url || ''} />
              <AvatarFallback>
                {selectedUser.full_name?.charAt(0) ||
                  selectedUser.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {selectedUser.full_name || 'Unknown User'}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.email}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAdd} disabled={addMember.isPending}>
            {addMember.isPending ? 'Adding...' : 'Add Member'}
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <div className="py-4">
      <UserSearchInput
        onSelect={handleSelectUser}
        excludeIds={existingMemberIds}
        placeholder="Search by email or name..."
      />
    </div>
  );
};
