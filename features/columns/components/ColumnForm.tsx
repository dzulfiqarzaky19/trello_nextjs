'use client';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormSubmit } from '@/components/form/FormSubmit';
import { FormRadio } from '@/components/form/FormRadio';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateColumn } from '@/features/columns/api/useCreateColumn';
import { useForm } from 'react-hook-form';
import { useProjectId } from '@/features/projects/hooks/useProjectId';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  headerColor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const COLORS = [
  { id: 'blue', value: 'bg-blue-500', label: 'Blue' },
  { id: 'purple', value: 'bg-purple-500', label: 'Purple' },
  { id: 'green', value: 'bg-green-500', label: 'Green' },
  { id: 'orange', value: 'bg-orange-500', label: 'Orange' },
  { id: 'red', value: 'bg-red-500', label: 'Red' },
  { id: 'gray', value: 'bg-gray-500', label: 'Gray' },
];

interface ModalColumnFormProps {
  closeModal?: () => void;
}

export const ColumnForm = ({ closeModal }: ModalColumnFormProps) => {
  const projectId = useProjectId();

  const { mutate, isPending } = useCreateColumn();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      headerColor: 'bg-blue-500',
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        json: {
          title: data.title,
          description: data.description,
          headerColor: data.headerColor,
          projectId,
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
      <div className="space-y-4">
        <FormInput
          label="Column Name"
          placeholder="e.g. QA Review, Backlog"
          {...register('title')}
          error={errors.title?.message}
        />

        <FormRadio
          control={control}
          name="headerColor"
          label="Header Color"
          options={COLORS}
          renderOption={(option, isSelected, onChange) => (
            <div key={option.id} className="relative">
              <input
                type="radio"
                id={`color-${option.id}`}
                value={option.value}
                className="peer sr-only"
                checked={isSelected}
                onChange={() => onChange(option.value)}
              />
              <Label
                htmlFor={`color-${option.id}`}
                className={cn(
                  'block size-8 rounded-full cursor-pointer transition-all hover:opacity-80 ring-offset-2 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-black',
                  option.value
                )}
              >
                <span className="sr-only">{option.label}</span>
              </Label>
              <Check className="absolute inset-0 m-auto text-white size-5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
          )}
        />

        <FormTextarea
          label="Description"
          placeholder="What is this column for?"
          {...register('description')}
          error={errors.description?.message}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={() => closeModal?.()}>
          Cancel
        </Button>
        <FormSubmit
          label="Create Column"
          isSubmitting={isSubmitting || isPending}
          isDisabled={isPending}
        />
      </DialogFooter>
    </form>
  );
};
