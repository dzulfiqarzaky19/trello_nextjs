import { createSupabaseServer } from '@/lib/supabase/server';
import { getErrorMessage } from '@/lib/supabase/types';

type HttpErrorStatus = 400 | 401 | 404 | 500;

interface ServiceSuccess<T> {
  ok: true;
  data: T;
}

interface ServiceError {
  ok: false;
  error: string;
  status: HttpErrorStatus;
}

type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

interface ChangePasswordInput {
  email: string;
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfileInput {
  userId: string;
  fullName: string;
  role: string;
  bio?: string;
}

export class SettingsService {
  static async changePassword(
    input: ChangePasswordInput
  ): Promise<ServiceResult<{ message: string }>> {
    const supabase = await createSupabaseServer();

    try {
      // Step 1: Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.currentPassword,
      });

      if (signInError) {
        return { ok: false, error: 'Incorrect current password', status: 401 };
      }

      // Step 2: Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: input.newPassword,
      });

      if (updateError) {
        return { ok: false, error: updateError.message, status: 401 };
      }

      return { ok: true, data: { message: 'Password updated successfully' } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async updateProfile(
    input: UpdateProfileInput
  ): Promise<ServiceResult<{ message: string }>> {
    const supabase = await createSupabaseServer();

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: input.fullName,
          role: input.role,
          bio: input.bio,
        })
        .eq('id', input.userId);

      if (updateError) {
        return { ok: false, error: updateError.message, status: 401 };
      }

      return { ok: true, data: { message: 'Profile updated successfully' } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }
}
