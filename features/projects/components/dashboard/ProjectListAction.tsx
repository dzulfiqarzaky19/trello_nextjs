'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { Project } from '../../types';
import { useDeleteProjectModal } from '../../hooks/useDeleteProjectModal';
import { useEditProjectModal } from '../../hooks/useEditProjectModal';

interface IProjectListActionProps {
  project: Project;
}

export const ProjectListAction = ({ project }: IProjectListActionProps) => {
  const handleEdit = useEditProjectModal({ project });
  const handleDelete = useDeleteProjectModal({ projectId: project.id });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-white bg-black/20 hover:bg-black/40 rounded-sm"
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] z-50">
        <DropdownMenuItem
          className="font-medium p-[10px] cursor-pointer"
          onClick={handleEdit}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Project
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-amber-600 font-medium p-[10px] cursor-pointer focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-900/10"
          onClick={handleDelete}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
