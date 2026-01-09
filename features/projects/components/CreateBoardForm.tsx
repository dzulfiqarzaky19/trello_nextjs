'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateProject } from '../api/useCreateProject';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema } from '../schema';
import { z } from 'zod';
import { FormInput } from '@/components/form/FormInput'; // Assuming these exist from workspace form
import { FormImageInput } from '@/components/form/FormImageInput';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface CreateBoardFormProps {
  workspaceId?: string;
  closeModal?: () => void;
}

// We can infer type from schema, but schema expects File | string for image.
// React Hook Form handles FileList usually.
type FormValues = z.infer<typeof createProjectSchema>;

export const CreateBoardForm = ({
  workspaceId: propWorkspaceId,
  closeModal,
}: CreateBoardFormProps) => {
  const { mutate, isPending } = useCreateProject();
  const params = useParams();

  const workspaceId = propWorkspaceId || (params.workspaceId as string);

  const form = useForm<FormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      workspace_id: workspaceId || '',
      // image: undefined, // Let image be handled by FormImageInput which expects field value
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    if (!workspaceId) {
      toast.error('Workspace ID is missing');
      return;
    }

    // Explicitly set workspace_id if not in form (though we set default)
    data.workspace_id = workspaceId;

    mutate(
      {
        form: {
          ...data,
          // Image handling depends on how FormImageInput passes value.
          // If it passes File, we act accordingly.
          // Hono RPC form helper usually handles File objects automatically if we pass FormData or object that converts to it.
        },
      },
      {
        onSuccess: () => {
          closeModal?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-2">
          Create New Board
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Start organizing your tasks in a new project board.
        </DialogDescription>
      </DialogHeader>

      <FormInput
        id="name"
        label="Board Title"
        placeholder="e.g. Website Redesign"
        {...register('name')}
        error={errors.name?.message}
        disabled={isPending}
      />

      <FormImageInput label="Cover Image" control={control} name="image" />

      <DialogFooter className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isPending || !workspaceId}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Board
        </Button>
      </DialogFooter>
    </form>
  );
};
