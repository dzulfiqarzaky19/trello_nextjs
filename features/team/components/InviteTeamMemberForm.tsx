'use client';

import { useState } from 'react';
import { useGetWorkspaces } from '@/features/workspaces/api/useGetWorkspaces';
import { useGetMembers } from '@/features/members/api/useGetMembers';
import { useAddMember } from '@/features/members/api/useAddMember';
import { UserSearchInput } from '@/features/users/components/UserSearchInput';
import { IUserSearchResult } from '@/features/users/schema';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Copy, Mail } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const InviteTeamMemberForm = () => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<IUserSearchResult | null>(
    null
  );

  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetWorkspaces();
  const { data: membersData } = useGetMembers(selectedWorkspaceId || undefined);
  const addMember = useAddMember();

  const selectedWorkspace = workspaces?.find(
    (w) => w.id === selectedWorkspaceId
  );
  const existingMemberIds =
    membersData?.data?.members.map((m) => m.user_id) || [];

  const handleSelectUser = (user: IUserSearchResult) => {
    setSelectedUser(user);
  };

  const handleConfirmAdd = () => {
    if (!selectedUser || !selectedWorkspaceId) return;
    addMember.mutate(
      {
        json: { workspaceId: selectedWorkspaceId, userId: selectedUser.id },
        workspaceId: selectedWorkspaceId,
      },
      {
        onSuccess: () => {
          setSelectedUser(null);
          toast.success(
            `Added ${selectedUser.full_name || selectedUser.email} to ${selectedWorkspace?.name}`
          );
        },
      }
    );
  };

  const copyInviteCode = () => {
    if (!selectedWorkspace?.invite_code) return;
    navigator.clipboard.writeText(selectedWorkspace.invite_code);
    toast.success('Invite code copied to clipboard');
  };

  const sendEmail = () => {
    if (!selectedWorkspace) return;
    const subject = encodeURIComponent(
      `Invitation to join ${selectedWorkspace.name} on Trello Clone`
    );
    const body = encodeURIComponent(
      `Hi!\n\nI'd like to invite you to join our workspace "${selectedWorkspace.name}" on Trello.\n\nYou can join using the invite code: ${selectedWorkspace.invite_code}\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Workspace</label>
        <Select
          onValueChange={(value) => {
            setSelectedWorkspaceId(value);
            setSelectedUser(null);
          }}
          disabled={isLoadingWorkspaces}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pick a workspace..." />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedWorkspaceId && (
        <>
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

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Invite Code</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-sm bg-muted px-3 py-2 rounded-md border text-center font-bold">
                  {selectedWorkspace?.invite_code}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyInviteCode}
                  title="Copy Code"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={sendEmail}
                  title="Invite via Email"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this code can join the workspace.
              </p>
            </div>
          </div>
        </>
      )}

      {!selectedWorkspaceId && (
        <div className="py-8 text-center border-2 border-dashed rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Please select a workspace to invite members
          </p>
        </div>
      )}
    </div>
  );
};
