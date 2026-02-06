import { CardDemo } from '@/components/Card';
import { Task } from '@/features/tasks/types';
import { useEditTaskModal } from '@/features/tasks/hooks/useEditTaskModal';
import { Draggable } from '@hello-pangea/dnd';

interface ProjectTaskProps {
  task: Task;
  index: number;
  columnName: string;
}

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export const ProjectTask = ({ task, index, columnName }: ProjectTaskProps) => {
  const openEditTaskModal = useEditTaskModal();

  const handleOpenTask = () => {
    openEditTaskModal(task, columnName);
  };

  const commentCount = task.comments?.[0]?.count || 0;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="cursor-pointer" onClick={handleOpenTask}>
            <CardDemo title={task.title} description={task.description}>
              <div className="flex items-center justify-between mt-3 text-muted-foreground">
                <div className="flex items-center gap-3 text-xs">
                  {task.deadlines && (
                    <div className="flex items-center hover:text-foreground transition-colors">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {format(new Date(task.deadlines), 'MMM d')}
                    </div>
                  )}
                  {commentCount > 0 && (
                    <div className="flex items-center hover:text-foreground transition-colors">
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      {commentCount}
                    </div>
                  )}
                </div>
                {task.assigned_to_user && (
                  <Avatar className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={task.assigned_to_user.avatar_url || ''} />
                    <AvatarFallback className="text-[10px]">
                       {task.assigned_to_user.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </CardDemo>
          </div>
        </div>
      )}
    </Draggable>
  );
};
