import { Tables } from '@/lib/supabase/database.types';

export type Comment = Tables<'task_comments'> & {
  profiles: Tables<'profiles'>;
};
