'use client';

import { z } from 'zod';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Mail } from 'lucide-react';
import { useMe } from '@/features/auth/api/useMe';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schema';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormSubmit } from '@/components/form/FormSubmit';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useProfile } from '../api/useProfile';

type IProfileForm = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const { data } = useMe();
  const { mutateAsync } = useProfile();

  const profile = data && 'profile' in data ? data.profile : null;
  const userEmail = data && 'user' in data ? data.user.email : null;
  const fullName = profile?.full_name || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: profile?.full_name || '',
      role: profile?.role || '',
      bio: profile?.bio || '',
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const onSubmit = async (data: IProfileForm) => {
    if (!isDirty) return;

    try {
      const result = await mutateAsync({
        json: data,
      });

      if ('error' in result) {
        return;
      }
      reset(data);
    } catch {
      // Error handled by useMutation.onError
    }
  };

  if (!data) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 bg-orange-100">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback>
              {fullName && fullName[0] ? fullName[0] : 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <p className="font-medium">Avatar</p>
            <p className="text-xs text-muted-foreground">
              Managed via Supabase / UI Avatars for now
            </p>
          </div>
        </div>

        <FormInput
          label="Full Name"
          {...register('fullName')}
          error={errors.fullName?.message}
        />

        <FormInput
          label="Role"
          {...register('role')}
          error={errors.role?.message}
        />

        <FormInput
          label="Email Address"
          id="email"
          defaultValue={userEmail || ''}
          disabled
          icon={<Mail width={16} height={16} />}
        />

        <FormTextarea
          label="Bio"
          className="min-h-[100px] resize-none"
          {...register('bio')}
          error={errors.bio?.message}
        />
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-6">
        <FormSubmit
          label="Save Changes"
          isSubmitting={isSubmitting}
          isDisabled={!isDirty}
        />
      </CardFooter>
    </form>
  );
};
