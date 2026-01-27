import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import { createColumnSchema, updateColumnSchema } from '../schema';
import { TablesUpdate } from '@/lib/supabase/database.types';
import { hasProjectData } from '@/lib/supabase/types';
import { logActivity } from '@/lib/audit-logs';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ projectId: z.string() })),
    async (c) => {
      const supabase = await createSupabaseServer();
      const { projectId } = c.req.valid('query');

      const { data, error } = await supabase
        .from('columns')
        .select('*, tasks(*)')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) {
        return c.json({ error: error.message }, 500);
      }

      const columnsWithSortedTasks = data.map((column) => ({
        ...column,
        tasks: Array.isArray(column.tasks)
          ? column.tasks.sort((a, b) => a.position - b.position)
          : [],
      }));

      return c.json({ data: columnsWithSortedTasks });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createColumnSchema),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { title, projectId } = c.req.valid('json');

      const { data: project } = await supabase
        .from('projects')
        .select('id, workspace_id, name')
        .eq('id', projectId)
        .single();
      if (!project) return c.json({ error: 'Project not found' }, 404);

      const { data: maxPosData } = await supabase
        .from('columns')
        .select('position')
        .eq('project_id', projectId)
        .order('position', { ascending: false })
        .limit(1)
        .single();

      const newPosition = (maxPosData?.position ?? 0) + 1;

      const { data, error } = await supabase
        .from('columns')
        .insert({
          name: title,
          project_id: projectId,
          position: newPosition,
          created_by: user.id,
          updated_by: user.id,
        })
        .select()
        .single();

      if (error) return c.json({ error: error.message }, 500);

      return c.json({ data });
    }
  )
  .patch(
    '/:columnId',
    sessionMiddleware,
    zValidator('param', z.object({ columnId: z.string() })),
    zValidator('json', updateColumnSchema),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { columnId } = c.req.valid('param');
      const { title, position } = c.req.valid('json');

      const { data: currentCol } = await supabase
        .from('columns')
        .select('*, projects(workspace_id, name)')
        .eq('id', columnId)
        .single();

      if (!currentCol) return c.json({ error: 'Column not found' }, 404);

      let workspaceId = '';
      let projectName = '';
      if (hasProjectData(currentCol) && currentCol.projects) {
        workspaceId = currentCol.projects.workspace_id;
        projectName = currentCol.projects.name;
      }

      const updates: TablesUpdate<'columns'> = {
        updated_at: new Date().toISOString(),
      };
      if (title) updates.name = title;

      if (position !== undefined && position !== currentCol.position) {
        const oldPos = currentCol.position;
        const newPos = position;
        const projectId = currentCol.project_id;

        if (newPos > oldPos) {
          const { error: rpcError } = await supabase.rpc(
            'decrement_column_positions',
            {
              p_project_id: projectId,
              p_start_pos: oldPos + 1,
              p_end_pos: newPos,
            }
          );
          if (rpcError) return c.json({ error: rpcError.message }, 500);
        } else {
          const { error: rpcError } = await supabase.rpc(
            'increment_column_positions',
            {
              p_project_id: projectId,
              p_start_pos: newPos,
              p_end_pos: oldPos - 1,
            }
          );
          if (rpcError) return c.json({ error: rpcError.message }, 500);
        }
        updates.position = newPos;
      }

      const { data, error } = await supabase
        .from('columns')
        .update(updates)
        .eq('id', columnId)
        .select()
        .single();

      if (error) return c.json({ error: error.message }, 500);

      if (position !== undefined && position !== currentCol.position) {
        await logActivity({
          action: 'MOVE',
          entityType: 'COLUMN',
          entityId: columnId,
          entityTitle: currentCol.name,
          workspaceId: workspaceId,
          userId: user.id,
          metadata: { from: currentCol.position, to: position, projectName },
        });
      } else if (title && title !== currentCol.name) {
        await logActivity({
          action: 'UPDATE_NAME',
          entityType: 'COLUMN',
          entityId: columnId,
          entityTitle: title,
          workspaceId: workspaceId,
          userId: user.id,
          metadata: { from: currentCol.name, to: title, projectName },
        });
      }

      return c.json({ data });
    }
  )
  .delete(
    '/:columnId',
    sessionMiddleware,
    zValidator('param', z.object({ columnId: z.string() })),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { columnId } = c.req.valid('param');

      const { data: column } = await supabase
        .from('columns')
        .select('name, projects(workspace_id, name)')
        .eq('id', columnId)
        .single();

      if (!column) return c.json({ error: 'Column not found' }, 404);

      let workspaceId = '';
      let projectName = '';
      if (hasProjectData(column) && column.projects) {
        workspaceId = column.projects.workspace_id;
        projectName = column.projects.name;
      }

      const { data, error } = await supabase
        .from('columns')
        .delete()
        .eq('id', columnId)
        .select()
        .single();

      if (error) return c.json({ error: error.message }, 500);

      return c.json({ data });
    }
  );

export default app;
