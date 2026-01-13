'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MemberActions } from './MemberActions';
import { Member } from '../types';

interface MemberItemProps {
  member: Member;
  isAdmin: boolean;
  currentUserId: string;
  workspaceId: string;
}

export const MemberItem = ({
  member,
  isAdmin,
  currentUserId,
  workspaceId,
}: MemberItemProps) => (
  <div className="flex items-center justify-between p-4">
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
          {currentUserId === member.user_id && (
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

      {isAdmin && currentUserId !== member.user_id && (
        <MemberActions
          workspaceId={workspaceId}
          userId={member.user_id}
          memberName={member.profiles?.full_name || 'this member'}
          currentRole={member.role}
        />
      )}
    </div>
  </div>
);
