'use client';

import { Button } from '@/components/ui/button';
import { useCreateProject } from '../../api/useCreateProject';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema } from '../../schema';
import { z } from 'zod';
import { FormInput } from '@/components/form/FormInput';
import { FormImageInput } from '@/components/form/FormImageInput';
import { DialogFooter } from '@/components/ui/dialog';
import { useGetProjects } from '../../api/useGetProjects';

interface ProjectCreateFormProps {
  closeModal?: () => void;
}

type FormValues = z.infer<typeof createProjectSchema>;

export const ProjectCreateForm = ({ closeModal }: ProjectCreateFormProps) => {
  const { mutate, isPending } = useCreateProject();
  const { data } = useGetProjects();

  const workspaceId = data?.workspaceId;

  const form = useForm<FormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      workspace_id: workspaceId || '',
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

    data.workspace_id = workspaceId;

    mutate(
      {
        form: {
          ...data,
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
      <FormInput
        id="name"
        label="Project Title"
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
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Project
        </Button>
      </DialogFooter>
    </form>
  );
};
