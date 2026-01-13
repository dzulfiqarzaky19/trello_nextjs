'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useUpdateColumn } from '@/features/columns/api/useUpdateColumn';
import { useGlobalModal } from '@/components/providers/ModalProvider';
import { FormInput } from '@/components/form/FormInput';
import { FormSubmit } from '@/components/form/FormSubmit';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface RenameColumnFormProps {
  columnId: string;
  currentTitle: string;
}

export const RenameColumnForm = ({
  columnId,
  currentTitle,
}: RenameColumnFormProps) => {
  const { closeWithBack } = useGlobalModal();
  const { mutate: updateColumn, isPending } = useUpdateColumn();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentTitle,
    },
  });

  const onSubmit = (data: FormValues) => {
    updateColumn(
      {
        param: { columnId },
        json: { title: data.title },
      },
      {
        onSuccess: () => {
          closeWithBack();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <FormInput
          label="Title"
          {...register('title')}
          placeholder="List title"
          error={errors.title?.message}
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={closeWithBack}
          disabled={isPending}
        >
          Cancel
        </Button>
        <FormSubmit
          label="Save"
          isSubmitting={isSubmitting || isPending}
          isDisabled={isPending}
        />
      </DialogFooter>
    </form>
  );
};
