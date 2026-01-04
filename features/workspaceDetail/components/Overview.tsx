import { format } from 'date-fns';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { IWorkspaceDetail } from '../schema';

interface OverviewProps {
    workspace: IWorkspaceDetail;
}

export const Overview = ({ workspace }: OverviewProps) => {
    const copyInviteCode = () => {
        navigator.clipboard.writeText(workspace.invite_code);
        toast.success('Invite code copied to clipboard');
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-y-4">
                    <div>
                        <h2 className="text-xl font-bold">Workspace Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-y-1">
                            <span className="text-sm font-medium text-muted-foreground">WORKSPACE NAME</span>
                            <p className="text-sm font-semibold">{workspace.name}</p>
                        </div>

                        <div className="flex flex-col gap-y-1">
                            <span className="text-sm font-medium text-muted-foreground">INVITE CODE</span>
                            <div className="flex items-center gap-x-2">
                                <p className="text-sm font-semibold font-mono bg-muted px-2 py-1 rounded">
                                    {workspace.invite_code}
                                </p>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyInviteCode}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-1">
                            <span className="text-sm font-medium text-muted-foreground">CREATED BY</span>
                            <div className="flex items-center gap-x-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={workspace.user?.avatar_url || ''} />
                                    <AvatarFallback>{workspace.user?.full_name?.charAt(0) || 'O'}</AvatarFallback>
                                </Avatar>
                                <p className="text-sm font-semibold">
                                    {workspace.user?.full_name}
                                    <span className="text-xs text-muted-foreground ml-1">(Owner)</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <span className="text-sm font-medium text-muted-foreground">CREATION DATE</span>
                            <p className="text-sm font-semibold">
                                {workspace.created_at ? format(new Date(workspace.created_at), 'MMMM d, yyyy') : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {workspace.description && (
                        <div className="flex flex-col gap-y-1 mt-2">
                            <span className="text-sm font-medium text-muted-foreground">DESCRIPTION</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {workspace.description}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
