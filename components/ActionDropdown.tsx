'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface IActionDropdownProps {
    onEdit?: () => void;
    onDelete?: () => void;
    disabled?: boolean;
    trigger?: ReactNode;
}

export const ActionDropdown = ({
    onEdit,
    onDelete,
    disabled,
    trigger,
}: IActionDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {trigger || (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground bg-background/50 backdrop-blur-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            onEdit();
                        }}
                        disabled={disabled}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                )}

                {onDelete && (
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            onDelete();
                        }}
                        disabled={disabled}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
