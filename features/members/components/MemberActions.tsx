'use client';

import { MoreHorizontal, Shield, User, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUpdateMemberRole } from '../api/useUpdateMemberRole';
import { useRemoveMember } from '../api/useRemoveMember';
import { useModal } from '@/components/providers/ModalProvider';

interface MemberActionsProps {
  workspaceId: string;
  userId: string;
  memberName: string;
  currentRole: 'ADMIN' | 'MEMBER';
}

export const MemberActions = ({
  workspaceId,
  userId,
  memberName,
  currentRole,
}: MemberActionsProps) => {
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();
  const { openModal, closeWithBack } = useModal('member-action');

  const handlePromote = () => {
    openModal({
      title: 'Promote to Admin',
      description: `Are you sure you want to promote ${memberName} to admin? They will have full control over this workspace.`,
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Promote',
        isConfirming: updateRole.isPending,
        onConfirm: () => {
          updateRole.mutate(
            { workspaceId, userId, role: 'ADMIN' },
            { onSuccess: () => closeWithBack() }
          );
        },
      },
    });
  };

  const handleDemote = () => {
    openModal({
      title: 'Demote to Member',
      description: `Are you sure you want to demote ${memberName} to member? They will lose admin privileges.`,
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Demote',
        isConfirming: updateRole.isPending,
        onConfirm: () => {
          updateRole.mutate(
            { workspaceId, userId, role: 'MEMBER' },
            { onSuccess: () => closeWithBack() }
          );
        },
      },
    });
  };

  const handleRemove = () => {
    openModal({
      title: 'Remove Member',
      description: `Are you sure you want to remove ${memberName} from this workspace? They will lose access to all projects.`,
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Remove',
        confirmVariant: 'destructive',
        isConfirming: removeMember.isPending,
        onConfirm: () => {
          removeMember.mutate(
            { workspaceId, userId },
            { onSuccess: () => closeWithBack() }
          );
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentRole === 'MEMBER' ? (
          <DropdownMenuItem onClick={handlePromote}>
            <Shield className="h-4 w-4 mr-2" />
            Promote to Admin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleDemote}>
            <User className="h-4 w-4 mr-2" />
            Demote to Member
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleRemove}
          className="text-red-600 focus:text-red-600"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Remove from Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
