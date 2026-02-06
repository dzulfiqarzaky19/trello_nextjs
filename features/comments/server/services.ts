import { createSupabaseServer } from '@/lib/supabase/server';
import { getErrorMessage } from '@/lib/supabase/types';
import { z } from 'zod';
import { createCommentSchema, updateCommentSchema } from '../schema';
import { ServiceResult } from '@/lib/service-result';
import { Comment } from '../types';
import { TaskService } from '@/features/tasks/server/services';

export class CommentService {
  static async getComments(
    userId: string,
    taskId: string
  ): Promise<ServiceResult<Comment[]>> {
    try {
      const taskResult = await TaskService.getById(userId, taskId);
      if (!taskResult.ok) return taskResult;

      const supabase = await createSupabaseServer();
      const { data, error } = await supabase
        .from('task_comments')
        .select('*, profiles(*)')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Ensure data matches Comment type (casting might be needed if TS doesn't infer deeply joined types perfectly)
      const comments = data as unknown as Comment[];

      return { ok: true, data: comments };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async createComment(
    userId: string,
    input: z.infer<typeof createCommentSchema>
  ): Promise<ServiceResult<Comment>> {
    try {
      const taskResult = await TaskService.getById(userId, input.taskId);
      if (!taskResult.ok) return taskResult;

      const supabase = await createSupabaseServer();
      const { data, error } = await supabase
        .from('task_comments')
        .insert({
          content: input.content,
          task_id: input.taskId,
          user_id: userId,
          parent_id: input.parentId,
        })
        .select('*, profiles(*)')
        .single();

      if (error) throw error;

      return { ok: true, data: data as unknown as Comment };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async updateComment(
    userId: string,
    commentId: string,
    input: z.infer<typeof updateCommentSchema>
  ): Promise<ServiceResult<Comment>> {
    try {
      const supabase = await createSupabaseServer();

      // We rely on RLS for permission checks (must be author),
      // but we can also explicit check if needed. RLS is safer.
      const { data, error } = await supabase
        .from('task_comments')
        .update({
          content: input.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', commentId)
        .select('*, profiles(*)')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // The result contains 0 rows
          return {
            ok: false,
            error: 'Comment not found or unauthorized',
            status: 404,
          };
        }
        throw error;
      }

      return { ok: true, data: data as unknown as Comment };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async deleteComment(
    userId: string,
    commentId: string
  ): Promise<ServiceResult<void>> {
    try {
      const supabase = await createSupabaseServer();

      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }
}
