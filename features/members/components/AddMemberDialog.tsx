'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserSearchInput } from '@/features/users/components/UserSearchInput';
import { IUserSearchResult } from '@/features/users/schema';
import { useAddMember } from '../api/useAddMember';
import { Plus } from 'lucide-react';

interface AddMemberDialogProps {
    workspaceId: string;
    existingMemberIds: string[];
}

export const AddMemberDialog = ({
    workspaceId,
    existingMemberIds,
}: AddMemberDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUserSearchResult | null>(null);
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
                    setIsOpen(false);
                    setSelectedUser(null);
                },
            }
        );
    };

    const handleCancel = () => {
        setSelectedUser(null);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setSelectedUser(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Search for a user by email or name to add them to this workspace.
                    </DialogDescription>
                </DialogHeader>

                {selectedUser ? (
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
                ) : (
                    <div className="py-4">
                        <UserSearchInput
                            onSelect={handleSelectUser}
                            excludeIds={existingMemberIds}
                            placeholder="Search by email or name..."
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
