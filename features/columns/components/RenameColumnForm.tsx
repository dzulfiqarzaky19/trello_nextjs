'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateColumn } from '@/features/columns/api/useUpdateColumn';
import { Loader2 } from 'lucide-react';
import { useGlobalModal } from '@/components/providers/ModalProvider';

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
    formState: { errors },
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
        <Input
          {...register('title')}
          placeholder="List title"
          disabled={isPending}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
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
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};
