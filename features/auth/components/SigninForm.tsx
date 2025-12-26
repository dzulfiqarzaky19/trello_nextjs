'use client';

import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Field } from '@/components/ui/field';
import { useForm } from 'react-hook-form';
import { FormSubmit } from '@/components/form/FormSubmit';
import { FormInput } from '@/components/form/FormInput';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '../schemas';
import { useLogin } from '../api/useLogin';

type ISignInForm = z.infer<typeof signInSchema>;

export const SigninForm = ({ className }: React.ComponentProps<'form'>) => {
  const router = useRouter();
  const { mutateAsync } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: ISignInForm) => {
    try {
      const result = await mutateAsync({
        json: data,
      });

      if ('error' in result) {
        toast.error(result.error);
        return;
      }

      toast.success('Signed in successfully');
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
        label="Email"
        type="email"
        placeholder="m@example.com"
        required
        {...register('email')}
        error={errors.email?.message}
      />

      <FormInput
        label="Password"
        type="password"
        required
        {...register('password')}
        error={errors.password?.message}
      />

      <div className="flex items-center">
        <a
          href="#"
          className="ml-auto text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </a>
      </div>

      <Field>
        <FormSubmit label="Sign In" isSubmitting={isSubmitting} />
      </Field>
    </form>
  );
};
