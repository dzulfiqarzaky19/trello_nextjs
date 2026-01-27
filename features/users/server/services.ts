import { createSupabaseServer } from '@/lib/supabase/server';
import { getErrorMessage } from '@/lib/supabase/types';
import { userSearchResponseSchema } from '../schema';
import { z } from 'zod';

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

export class UserService {
    static async search(
        query: string,
        currentUserId: string
    ): Promise<ServiceResult<z.infer<typeof userSearchResponseSchema>>> {
        const supabase = await createSupabaseServer();

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, full_name, avatar_url')
                .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
                .neq('id', currentUserId)
                .limit(10);

            if (error) throw error;

            const result = userSearchResponseSchema.safeParse({ data: data || [] });

            if (!result.success) {
                return { ok: false, error: 'Data validation failed', status: 500 };
            }

            return { ok: true, data: result.data };
        } catch (error) {
            return { ok: false, error: getErrorMessage(error), status: 500 };
        }
    }
}
