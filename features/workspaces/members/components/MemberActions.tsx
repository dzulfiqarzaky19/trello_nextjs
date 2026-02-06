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
import { useMemberActionModals } from '../hooks/useMemberActionModals';

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
  const { openPromote, openDemote, openRemove } = useMemberActionModals();

  const handlePromote = () => openPromote({ workspaceId, userId, memberName });
  const handleDemote = () => openDemote({ workspaceId, userId, memberName });
  const handleRemove = () => openRemove({ workspaceId, userId, memberName });

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
