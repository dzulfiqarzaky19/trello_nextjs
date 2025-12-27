'use client';

import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Field } from '@/components/ui/field';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/FormInput';
import { FormSubmit } from '@/components/form/FormSubmit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../schemas';
import { useRegister } from '../api/useRegister';
import { FormPasswordInput } from '@/components/form/FormPasswordInput';

type ISignUpForm = z.infer<typeof signUpSchema>;

export const SignupForm = ({ className }: React.ComponentProps<'form'>) => {
  const router = useRouter();
  const { mutateAsync } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: ISignUpForm) => {
    try {
      const result = await mutateAsync({
        json: data,
      });

      if ('error' in result) {
        toast.error(result.error);
        return;
      }

      if (typeof result.response === 'string') {
        toast.success(result.response);
        router.push(`/sign-in?message=${encodeURIComponent(result.response)}`);
        return;
      }

      toast.success('Account created! Logging in...');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-6', className)}
    >
      <FormInput
        label="Full Name"
        type="text"
        placeholder="John Doe"
        required
        {...register('fullName')}
        error={errors.fullName?.message}
      />

      <FormInput
        label="Email"
        type="email"
        placeholder="m@example.com"
        required
        {...register('email')}
        error={errors.email?.message}
      />

      <FormPasswordInput
        label="Password"
        required
        {...register('password')}
        error={errors.password?.message}
      />

      <FormPasswordInput
        label="Confirm Password"
        required
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Field>
        <FormSubmit label="Create Account" isSubmitting={isSubmitting} />
      </Field>
    </form>
  );
};
