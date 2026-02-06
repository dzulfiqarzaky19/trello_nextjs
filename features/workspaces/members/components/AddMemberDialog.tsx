'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAddMemberModal } from '../hooks/useAddMemberModal';

export const AddMemberDialog = () => {
  const { open } = useAddMemberModal();

  return (
    <Button onClick={open}>
      <Plus className="h-4 w-4 mr-2" />
      Add Member
    </Button>
  );
};
