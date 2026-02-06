'use client';

import { Button } from '@/components/ui/button';
import {
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Card as CardType } from '../../projects/types';
import { AlignLeft, Laptop, Trash2, Loader2, Calendar } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormSubmit } from '@/components/form/FormSubmit';
import { FormDatePicker } from '@/components/form/FormDatePicker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateTask } from '@/features/tasks/api/useUpdateTask';
import { FormSelect } from '@/components/form/FormSelect';
import { useGetMembers } from '@/features/members/api/useGetMembers';

import { useCreateTask } from '@/features/tasks/api/useCreateTask';
import { useProjectId } from '../../projects/hooks/useProjectId';
import { useDeleteTaskModal } from '@/features/tasks/hooks/useDeleteTaskModal';
import { useGetProject } from '@/features/projects/api/useGetProject';
import { TaskComments } from '@/features/comments/components/TaskComments';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  deadlines: z.string().min(1, 'Deadline is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface ModalFormProps {
  card?: CardType;
  listTitle: string;
  columnId?: string;
  closeModal?: () => void;
}

export const TaskForm = ({
  card,
  listTitle,
  columnId,
  closeModal,
}: ModalFormProps) => {
  const isEditing = !!card;
  const projectId = useProjectId();
  const { openDeleteTaskModal, isDeleting } = useDeleteTaskModal();

  const { data: project } = useGetProject();

  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();

  const { data: members } = useGetMembers(project?.workspace_id);
  const memberOptions =
    members?.data.members.map((member) => ({
      label: member.profiles.full_name || member.profiles.email || 'Unknown',
      value: member.user_id,
    })) || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: card?.title || '',
      description: card?.description || '',
      assignedTo: card?.assigned_to || '',
      deadlines: card?.deadlines || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    const deadlinesISO = new Date(data.deadlines).toISOString();

    if (isEditing && card) {
      updateTask(
        {
          param: { taskId: card.id },
          json: {
            title: data.title,
            description: data.description,
            assignedTo: data.assignedTo,
            deadlines: deadlinesISO,
          },
        },
        {
          onSuccess: () => closeModal?.(),
        }
      );
    } else if (columnId && projectId) {
      createTask(
        {
          json: {
            title: data.title,
            description: data.description || '',
            assignedTo: data.assignedTo,
            deadlines: deadlinesISO,
            columnId,
            projectId,
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
      openDeleteTaskModal(card);
    }
  };

  const isLoading = isUpdating || isDeleting || isCreating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-h-0 flex flex-col">


      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-full">
          {/* Left Column: Details */}
          <div className="space-y-8 p-6 scroll-smooth h-full md:overflow-y-auto md:min-h-0">
            {/* Title Section */}
            <div className="flex items-start gap-4">
              <Laptop className="mt-1 size-5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <DialogTitle className="flex items-center gap-2">
                  <FormInput
                    {...register('title')}
                    placeholder="Task Title"
                    className="font-semibold text-xl border-none shadow-none focus-visible:ring-0 px-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground/50 w-full"
                    disabled={isLoading}
                    error={errors.title?.message}
                  />
                </DialogTitle>
                <div className="text-sm text-muted-foreground">
                  in list{' '}
                  <span className="font-medium text-foreground">{listTitle}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[24px_1fr] gap-4">
              <Calendar className="mt-1 size-5 text-muted-foreground" />
              <div className="space-y-2">
                <FormDatePicker
                  control={control}
                  name="deadlines"
                  label="Deadlines"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-[24px_1fr] gap-4">
              <div className="mt-1 size-5 bg-transparent" />
              <div className="space-y-2">
                <FormSelect
                  control={control}
                  name="assignedTo"
                  label="Assign To"
                  placeholder="Select assignee..."
                  options={memberOptions}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-[24px_1fr] gap-4">
              <AlignLeft className="mt-1 size-5 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="font-semibold text-base">Description</h3>
                <FormTextarea
                  label=""
                  {...register('description')}
                  placeholder="Add a more detailed description..."
                  className="resize-none min-h-[120px]"
                  disabled={isLoading}
                  error={errors.description?.message}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Activity */}
          <div className="flex flex-col border-l bg-gray-50/50 p-6 h-full md:min-h-0">
            {isEditing && card ? (
              <TaskComments taskId={card.id} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                <p>Save task to add comments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="px-6 py-4 border-t flex justify-between items-center sm:justify-between bg-background shrink-0 z-10">
        {isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isLoading}
            className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 pl-2"
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
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal?.()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <FormSubmit
            label={isEditing ? 'Save Changes' : 'Create Task'}
            isSubmitting={isLoading}
            isDisabled={isLoading || (isEditing && !isDirty)}
          />
        </div>
      </DialogFooter>
    </form>
  );
};
