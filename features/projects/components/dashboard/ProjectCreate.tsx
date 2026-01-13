'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useCreateProjectModal } from '../../hooks/useCreateProjectModal';


export const ProjectCreate = () => {
  const { open } = useCreateProjectModal();

  return (
    <Card
      onClick={open}
      className="hover:shadow-lg transition-shadow cursor-pointer h-32 flex items-center justify-center bg-muted/50 hover:bg-muted border-dashed"
    >
      <CardContent className="flex flex-col items-center gap-2 p-6">
        <Plus className="w-8 h-8 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Create New Project
        </span>
      </CardContent>
    </Card>
  );
};
