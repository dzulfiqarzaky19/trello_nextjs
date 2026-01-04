'use client';

import { createCard, updateCard } from '@/features/projects/cards/actions'; // These will need updates or replacements
import { CardDemo } from '@/components/Card';
import { FormWrapper } from '@/components/form/FormWrapper';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Ellipsis, Plus, Loader2 } from 'lucide-react';
import { ModalForm } from './components/ModalForm';
import { ModalColumnForm } from './components/ModalColumnForm';
import { useGetProject } from './api/useGetProject';
import { Project } from './types';

interface ProjectsMainProps {
  projectId: string;
}

export const ProjectsMain = ({ projectId }: ProjectsMainProps) => {
  const { data: rawProject, isLoading, error } = useGetProject({ projectId });
  const project = rawProject as unknown as Project;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading project: {error?.message || 'Project not found'}
      </div>
    );
  }

  // Sort columns by position
  const sortedColumns = [...(project.columns || [])].sort((a, b) => a.position - b.position);

  return (
    <main className="flex justify-between gap-4 p-8 overflow-x-auto h-full">
      {sortedColumns.map((column) => {
        // Sort tasks by position
        const sortedTasks = [...(column.tasks || [])].sort((a, b) => a.position - b.position);

        return (
          <Card
            key={column.id}
            className="border-none shadow-none rounded-none bg-transparent min-w-[300px] flex flex-col max-h-full"
          >
            <CardHeader className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <div className={cn('size-2 rounded-full bg-gray-500')} />
                <CardTitle className="text-sm font-semibold">{column.name}</CardTitle>
                <div className="size-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  {sortedTasks.length}
                </div>
              </div>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 p-2 overflow-y-auto min-h-0 flex-1">
              {sortedTasks.map((task) => (
                <Modal
                  key={task.id}
                  trigger={
                    <div className="cursor-pointer">
                      <CardDemo
                        title={task.title}
                        description={task.description || ''}
                        labels={task.card_labels || []}
                        assignees={(task.card_members || []).map((cm: any) => ({
                          id: cm.user_id,
                          name: cm.profiles?.full_name || 'Unknown',
                          image: cm.profiles?.avatar_url || '',
                        }))}
                        comments={task.comments?.length || 0}
                        attachments={task.attachments?.length || 0}
                        status="todo" // TODO: map status?
                        progress={{ completed: 0, total: 0, percent: 0 }} // TODO: calc progress from checklist
                        dueDate={task.due_date || undefined}
                      />
                    </div>
                  }
                  modalClass="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                  <FormWrapper
                    action={async (formData) => {
                      // TODO: Implement update task via API hook
                      console.log('Update task', formData);
                    }}
                    className="flex flex-col h-full min-h-0"
                  >
                    <ModalForm
                      card={task as any} // Cast for now as types mismatch slightly (missing checklist tables etc)
                      listTitle={column.name}
                      boardId={project.id}
                    />
                  </FormWrapper>
                </Modal>
              ))}
            </CardContent>

            <CardFooter className="p-2">
              <Modal
                trigger={
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                }
                modalClass="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                <FormWrapper
                  action={async (formData) => {
                    // TODO: Implement create task via API hook
                    console.log('Create task', formData);
                  }}
                  className="flex flex-col h-full min-h-0"
                >
                  <ModalForm listTitle={column.name} boardId={project.id} />
                </FormWrapper>
              </Modal>
            </CardFooter>
          </Card>
        );
      })}

      {/* Add Column Button */}
      <div className="min-w-[300px]">
        <Modal
          trigger={
            <Button variant="ghost" className="w-full justify-start bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 h-12">
              <Plus className="mr-2 h-4 w-4" />
              Add List
            </Button>
          }
        >
          <ModalColumnForm projectId={projectId} />
        </Modal>
      </div>
    </main>
  );
};
