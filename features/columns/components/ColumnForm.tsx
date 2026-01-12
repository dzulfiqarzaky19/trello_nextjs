'use client';
import { Button } from '@/components/ui/button';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Loader2 } from 'lucide-react';
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      headerColor: 'bg-blue-500',
    },
  });

  const selectedColor = watch('headerColor');

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
        <div className="space-y-2">
          <Label htmlFor="title" className="font-semibold">
            Column Name
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="e.g. QA Review, Backlog"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">Header Color</Label>
          <div className="flex gap-2">
            {COLORS.map((color) => (
              <div key={color.id} className="relative">
                <input
                  type="radio"
                  id={`color-${color.id}`}
                  value={color.value}
                  className="peer sr-only"
                  checked={selectedColor === color.value}
                  onChange={() => setValue('headerColor', color.value)}
                />
                <Label
                  htmlFor={`color-${color.id}`}
                  className={cn(
                    'block size-8 rounded-full cursor-pointer transition-all hover:opacity-80 ring-offset-2 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-black',
                    color.value
                  )}
                >
                  <span className="sr-only">{color.label}</span>
                </Label>
                <Check className="absolute inset-0 m-auto text-white size-5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description" className="font-semibold">
              Description
            </Label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="What is this column for?"
            className="min-h-[100px]"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={() => closeModal?.()}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Column
        </Button>
      </DialogFooter>
    </form>
  );
};
