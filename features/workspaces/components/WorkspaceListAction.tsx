import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { workspaceSchema } from '../schema';
import { z } from 'zod';
import { useDeleteWorkspace } from '../api/useDeleteWorkspace';
import { Modal } from '@/components/Modal';
import { WorkspaceEditForm } from './WorkspaceEditForm';
import { useState } from 'react';
import { useMe } from '@/features/auth/api/useMe';

interface IWorkspaceListActionProps {
  workspace: z.infer<typeof workspaceSchema>;
}

export const WorkspaceListAction = ({
  workspace,
}: IWorkspaceListActionProps) => {
  const { data } = useMe();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();

  const isAdmin =
    data && 'user' in data ? data.user.id === workspace.user_id : false;

  if (!isAdmin) return null;

  const onDelete = () => {
    deleteWorkspace({ param: { workspaceId: workspace.id } });
    setIsDeleteOpen(false);
  };

  return (
    <>
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsEditOpen(true);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsDeleteOpen(true);
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Modal open={isEditOpen} onOpenChange={setIsEditOpen} trigger={null}>
        <WorkspaceEditForm
          workspace={workspace}
          onSuccess={() => setIsEditOpen(false)}
        />
      </Modal>

      <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} trigger={null}>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Delete Workspace</h2>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{workspace.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
