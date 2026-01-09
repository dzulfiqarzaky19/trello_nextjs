import { FormInput } from '@/components/form/FormInput';
import { FormSubmit } from '@/components/form/FormSubmit';
import { DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  updateWorkspaceSchema,
  IUpdateWorkspace,
  workspaceSchema,
} from '../../schema';
import { useUpdateWorkspace } from '../../api/useUpdateWorkspace';
import { FormImageInput } from '@/components/form/FormImageInput';
import { z } from 'zod';
import { slugify } from '../../utils';
import { FormTextarea } from '@/components/form/FormTextarea';

interface IWorkspaceEditFormProps {
  workspace: z.infer<typeof workspaceSchema>;
  closeModal?: () => void;
}

export const WorkspaceEditForm = ({
  workspace,
  closeModal,
}: IWorkspaceEditFormProps) => {
  const { mutateAsync } = useUpdateWorkspace();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    control,
  } = useForm<IUpdateWorkspace>({
    resolver: zodResolver(updateWorkspaceSchema),
    mode: 'onChange',
    defaultValues: {
      name: workspace.name,
      slug: workspace.slug,
      image: workspace.image_url || undefined,
      description: workspace.description || undefined,
    },
  });

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('name', value, { shouldValidate: true, shouldDirty: true });
    setValue('slug', slugify(value), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: IUpdateWorkspace) => {
    if (!isDirty) return;

    await mutateAsync({
      param: { workspaceId: workspace.id },
      form: data,
    });
    closeModal?.();

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Workspace Name"
        placeholder="e.g. Website Redesign"
        {...register('name')}
        error={errors.name?.message}
        onChange={onNameChange}
      />

      <FormInput
        label="Workspace Slug"
        placeholder="e.g. website-redesign"
        {...register('slug')}
        error={errors.slug?.message}
      />

      <FormTextarea
        label="Workspace Description"
        placeholder="e.g. Website Redesign"
        {...register('description')}
        error={errors.description?.message}
      />

      <FormImageInput label="Workspace Image" control={control} name="image" />

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
