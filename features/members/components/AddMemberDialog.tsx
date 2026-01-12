'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useModal } from '@/components/providers/ModalProvider';
import { AddMemberForm } from './AddMemberForm';

interface AddMemberDialogProps {
  workspaceId: string;
  existingMemberIds: string[];
}

export const AddMemberDialog = ({
  workspaceId,
  existingMemberIds,
}: AddMemberDialogProps) => {
  const { openModal, closeWithReplace } = useModal('add-member');

  const handleClick = () => {
    openModal({
      title: 'Add Member',
      description:
        'Search for a user by email or name to add them to this workspace.',
      children: (
        <AddMemberForm
          workspaceId={workspaceId}
          existingMemberIds={existingMemberIds}
          closeModal={closeWithReplace}
        />
      ),
      config: {
        showFooter: false,
      },
    });
  };

  return (
    <Button onClick={handleClick}>
      <Plus className="h-4 w-4 mr-2" />
      Add Member
    </Button>
  );
};
