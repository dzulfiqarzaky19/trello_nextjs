import { FormInput } from '@/components/form/FormInput';
import { FormSubmit } from '@/components/form/FormSubmit';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createWorkspaceSchema, ICreateWorkspace } from '../schema';
import { useCreateWorkspace } from '../api/useCreateWorkspace';
import { FormImageInput } from '@/components/form/FormImageInput';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const WorkspaceCreateForm = () => {
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
    defaultValues: {
      name: '',
      slug: '',
      image: undefined,
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
    } catch {
      // Error handled by useMutation.onError
    }
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
