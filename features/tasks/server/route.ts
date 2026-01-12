import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import { createTaskSchema, updateTaskSchema } from '../schema';

const app = new Hono()
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { title, description, columnId, projectId, position } =
        c.req.valid('json');

      const { data: member } = await supabase
        .from('members')
        .select('role')
        .eq(
          'workspace_id',
          supabase
            .from('projects')
            .select('workspace_id')
            .eq('id', projectId)
            .single() as any
        );

      const { data: project } = await supabase
        .from('projects')
        .select('workspace_id')
        .eq('id', projectId)
        .single();

      if (!project) return c.json({ error: 'Project not found' }, 404);

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          description,
          project_id: projectId,
          column_id: columnId,
          position,
        })
        .select()
        .single();

      if (error) return c.json({ error: error.message }, 500);

      return c.json({ data });
    }
  )
  .patch(
    '/:taskId',
    sessionMiddleware,
    zValidator('param', z.object({ taskId: z.string() })),
    zValidator('json', updateTaskSchema),
    async (c) => {
      const supabase = await createSupabaseServer();
      const { taskId } = c.req.valid('param');
      const { title, description, columnId, position } = c.req.valid('json');

      const { data: currentTask } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (!currentTask) return c.json({ error: 'Task not found' }, 404);

      const updates: any = { updated_at: new Date().toISOString() };
      if (title) updates.title = title;
      if (description) updates.description = description;

      if (position !== undefined && columnId !== undefined) {
        const oldColumnId = currentTask.column_id;
        const oldPosition = currentTask.position;
        const newColumnId = columnId;
        const newPosition = position;

        if (oldColumnId === newColumnId) {
          if (oldPosition !== newPosition) {
            if (newPosition > oldPosition) {
              const { error: rpcError } = await supabase.rpc(
                'decrement_task_positions',
                {
                  p_column_id: oldColumnId,
                  p_start_pos: oldPosition + 1,
                  p_end_pos: newPosition,
                }
              );
              if (rpcError) return c.json({ error: rpcError.message }, 500);
            } else {
              const { error: rpcError } = await supabase.rpc(
                'increment_task_positions',
                {
                  p_column_id: oldColumnId,
                  p_start_pos: newPosition,
                  p_end_pos: oldPosition - 1,
                }
              );
              if (rpcError) return c.json({ error: rpcError.message }, 500);
            }
          }
        } else {
          const { error: rpcError1 } = await supabase.rpc(
            'decrement_task_positions_from',
            {
              p_column_id: oldColumnId,
              p_start_pos: oldPosition + 1,
            }
          );
          if (rpcError1) return c.json({ error: rpcError1.message }, 500);

          const { error: rpcError2 } = await supabase.rpc(
            'increment_task_positions_from',
            {
              p_column_id: newColumnId,
              p_start_pos: newPosition,
            }
          );
          if (rpcError2) return c.json({ error: rpcError2.message }, 500);
        }

        updates.column_id = newColumnId;
        updates.position = newPosition;
      } else if (columnId !== undefined && columnId !== currentTask.column_id) {
        const { count } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('column_id', columnId);
        const newPos = (count || 0) + 1;

        const { error: rpcError } = await supabase.rpc(
          'decrement_task_positions_from',
          {
            p_column_id: currentTask.column_id,
            p_start_pos: currentTask.position + 1,
          }
        );
        if (rpcError) return c.json({ error: rpcError.message }, 500);

        updates.column_id = columnId;
        updates.position = newPos;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) return c.json({ error: error.message }, 500);

      return c.json({ data });
    }
  )
  .delete(
    '/:taskId',
    sessionMiddleware,
    zValidator('param', z.object({ taskId: z.string() })),
    async (c) => {
      const supabase = await createSupabaseServer();
      const { taskId } = c.req.valid('param');

      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .select()
        .single();

      if (error) return c.json({ error: error.message }, 500);
      return c.json({ data });
    }
  );

export default app;
