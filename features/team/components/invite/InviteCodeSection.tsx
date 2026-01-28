'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Mail } from 'lucide-react';

interface InviteCodeSectionProps {
  workspaceName: string;
  inviteCode: string;
}

export const InviteCodeSection = ({
  workspaceName,
  inviteCode,
}: InviteCodeSectionProps) => {
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied to clipboard');
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(
      `Invitation to join ${workspaceName} on Trello Clone`
    );
    const body = encodeURIComponent(
      `Hi!\n\nI'd like to invite you to join our workspace "${workspaceName}" on Trello.\n\nYou can join using the invite code: ${inviteCode}\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="space-y-2">
        <label className="text-sm font-medium">Share Invite Code</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 font-mono text-sm bg-muted px-3 py-2 rounded-md border text-center font-bold">
            {inviteCode}
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
  );
};
