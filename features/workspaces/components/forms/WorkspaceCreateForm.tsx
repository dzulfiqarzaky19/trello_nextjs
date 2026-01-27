import { FormInput } from '@/components/form/FormInput';
import { FormSubmit } from '@/components/form/FormSubmit';
import { DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createWorkspaceSchema, ICreateWorkspace } from '../../schema';
import { useCreateWorkspace } from '../../api/useCreateWorkspace';
import { FormImageInput } from '@/components/form/FormImageInput';
import { slugify } from '../../utils';
import { FormTextarea } from '@/components/form/FormTextarea';

export const WorkspaceCreateForm = ({
  closeModal,
}: {
  closeModal?: () => void;
}) => {
  const { mutateAsync } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    control,
  } = useForm<ICreateWorkspace>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      image: undefined,
      description: '',
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

  const onSubmit = async (data: ICreateWorkspace) => {
    if (!isDirty) return;

    try {
      await mutateAsync({
        form: data,
      });
      reset();
      closeModal?.();
    } catch {}
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
