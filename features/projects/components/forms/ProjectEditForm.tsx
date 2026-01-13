'use client';

import { FormInput } from '@/components/form/FormInput';
import { FormSubmit } from '@/components/form/FormSubmit';
import { DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormSelect } from '@/components/form/FormSelect';
import { z } from 'zod';
import { updateProjectSchema } from '../../schema';
import { useUpdateProject } from '../../api/useUpdateProject';
import { FormImageInput } from '@/components/form/FormImageInput';
import { Project } from '../../types';

interface ProjectEditFormProps {
  project: Project;
  closeModal?: () => void;
}

type FormValues = z.infer<typeof updateProjectSchema>;

export const ProjectEditForm = ({
  project,
  closeModal,
}: ProjectEditFormProps) => {
  const { mutateAsync } = useUpdateProject();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      status: project.status || 'ACTIVE',
      image: project.image_url || undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!isDirty) return;

    try {
      await mutateAsync({
        param: { projectId: project.id },
        form: data,
      });
      closeModal?.();
    } catch {
      // Error handled by useMutation.onError
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Project Name"
        placeholder="e.g. Website Redesign"
        {...register('name')}
        error={errors.name?.message}
      />

      <FormImageInput label="Project Image" control={control} name="image" />

      <FormSelect
        control={control}
        name="status"
        label="Status"
        placeholder="Select Status"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Archived', value: 'ARCHIVED' },
        ]}
      />

      <DialogFooter className="flex justify-end gap-2 pt-6">
        <FormSubmit
          label="Save Changes"
          isSubmitting={isSubmitting}
          isDisabled={!isDirty}
        />
      </DialogFooter>
    </form>
  );
};
