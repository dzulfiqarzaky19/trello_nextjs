'use client';

import { useState } from 'react';
import { MoreHorizontal, Shield, User, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUpdateMemberRole } from '../api/useUpdateMemberRole';
import { useRemoveMember } from '../api/useRemoveMember';

interface MemberActionsProps {
  workspaceId: string;
  userId: string;
  memberName: string;
  currentRole: 'ADMIN' | 'MEMBER';
}

type ActionType = 'promote' | 'demote' | 'remove' | null;

export const MemberActions = ({
  workspaceId,
  userId,
  memberName,
  currentRole,
}: MemberActionsProps) => {
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const handleConfirm = () => {
    switch (confirmAction) {
      case 'promote':
        updateRole.mutate({ workspaceId, userId, role: 'ADMIN' });
        break;
      case 'demote':
        updateRole.mutate({ workspaceId, userId, role: 'MEMBER' });
        break;
      case 'remove':
        removeMember.mutate({ workspaceId, userId });
        break;
    }
    setConfirmAction(null);
  };

  const getDialogContent = () => {
    switch (confirmAction) {
      case 'promote':
        return {
          title: 'Promote to Admin',
          description: `Are you sure you want to promote ${memberName} to admin? They will have full control over this workspace.`,
          actionLabel: 'Promote',
        };
      case 'demote':
        return {
          title: 'Demote to Member',
          description: `Are you sure you want to demote ${memberName} to member? They will lose admin privileges.`,
          actionLabel: 'Demote',
        };
      case 'remove':
        return {
          title: 'Remove Member',
          description: `Are you sure you want to remove ${memberName} from this workspace? They will lose access to all projects.`,
          actionLabel: 'Remove',
          destructive: true,
        };
      default:
        return { title: '', description: '', actionLabel: '' };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentRole === 'MEMBER' ? (
            <DropdownMenuItem onClick={() => setConfirmAction('promote')}>
              <Shield className="h-4 w-4 mr-2" />
              Promote to Admin
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setConfirmAction('demote')}>
              <User className="h-4 w-4 mr-2" />
              Demote to Member
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setConfirmAction('remove')}
            className="text-red-600 focus:text-red-600"
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Remove from Workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                confirmAction === 'remove' ? 'bg-red-600 hover:bg-red-700' : ''
              }
            >
              {dialogContent.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
