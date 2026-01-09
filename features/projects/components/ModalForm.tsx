'use client';

import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card as CardType } from '../types';
import { AlignLeft, Laptop, Trash2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateTask } from '../api/useUpdateTask';
import { useDeleteTask } from '../api/useDeleteTask';
import { useCreateTask } from '../api/useCreateTask';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ModalFormProps {
  card?: CardType;
  listTitle: string;
  boardId?: string;
  columnId?: string;
  closeModal?: () => void;
}

export const ModalForm = ({
  card,
  listTitle,
  boardId,
  columnId,
  closeModal,
}: ModalFormProps) => {
  const isEditing = !!card;
  const projectId = boardId || '';

  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask({
    projectId,
  });
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask({
    projectId,
  });
  const { mutate: createTask, isPending: isCreating } = useCreateTask({
    projectId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: card?.title || '',
      description: card?.description || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isEditing && card) {
      updateTask(
        {
          param: { projectId, taskId: card.id },
          json: {
            title: data.title,
            description: data.description,
          },
        },
        {
          onSuccess: () => closeModal?.(),
        }
      );
    } else if (columnId && projectId) {
      createTask(
        {
          param: { projectId },
          json: {
            title: data.title,
            description: data.description || '',
            columnId,
          },
        },
        {
          onSuccess: () => closeModal?.(),
        }
      );
    }
  };

  const onDelete = () => {
    if (card) {
      if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(
          {
            param: { projectId, taskId: card.id },
          },
          {
            onSuccess: () => closeModal?.(),
          }
        );
      }
    }
  };

  const isLoading = isUpdating || isDeleting || isCreating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Laptop className="mt-1 size-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <DialogTitle className="flex items-center gap-2">
                <Input
                  {...register('title')}
                  placeholder="Task Title"
                  className="font-semibold text-xl border-none shadow-none focus-visible:ring-0 px-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground/50"
                />
              </DialogTitle>
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
              <div className="text-sm text-muted-foreground">
                in list{' '}
                <span className="font-medium text-foreground">{listTitle}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-[24px_1fr] gap-4">
          <AlignLeft className="mt-1 size-5 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="font-semibold text-base">Description</h3>
            <Textarea
              {...register('description')}
              placeholder="Add a more detailed description..."
              className="min-h-[150px] resize-none"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="px-6 py-4 border-t flex justify-between items-center bg-muted/20">
        {isEditing ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isLoading}
            className="gap-2"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete Task
          </Button>
        ) : (
          <div />
        )}{' '}
        {/* Spacer */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal?.()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || (isEditing && !isDirty)}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
};
