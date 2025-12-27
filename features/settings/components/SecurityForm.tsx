'use client';

import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useSecurity } from '../api/useSecurity';
import { useForm } from 'react-hook-form';
import { securitySchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSubmit } from '@/components/form/FormSubmit';
import { FormPasswordInput } from '@/components/form/FormPasswordInput';

type ISecurityForm = z.infer<typeof securitySchema>;

export const SecurityForm = () => {
  const { mutateAsync } = useSecurity();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ISecurityForm>({
    resolver: zodResolver(securitySchema),
    values: {
      currentPassword: '',
      newPassword: '',
    },
    resetOptions: {
      keepValues: true,
    },
  });

  console.log(isDirty, isSubmitting);

  const onSubmit = async (data: ISecurityForm) => {
    if (!isDirty) return;

    const result = await mutateAsync({
      json: data,
    });

    if ('error' in result) {
      return;
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-6">
        <FormPasswordInput
          label="Current Password"
          placeholder="Confirmation required"
          required
          {...register('currentPassword')}
          error={errors.currentPassword?.message}
        />

        <FormPasswordInput
          label="New Password"
          placeholder="Minimum 8 characters"
          required
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-6">
        <Button
          variant="ghost"
          className="hover:bg-muted"
          onClick={() => reset()}
          disabled={!isDirty || isSubmitting}
        >
          Cancel
        </Button>

        <FormSubmit
          label="Save Changes"
          isSubmitting={isSubmitting}
          isDisabled={!isDirty}
        />
      </CardFooter>
    </form>
  );
};
