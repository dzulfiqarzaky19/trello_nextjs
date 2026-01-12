import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import { createProjectSchema, updateProjectSchema } from '../schema';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string().optional() })),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { workspaceId } = c.req.valid('query');

      let query = supabase.from('projects').select('*');
      let workspaceUuid = workspaceId;

      if (workspaceId) {
        const isUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            workspaceId
          );

        if (!isUuid) {
          const { data: workspace } = await supabase
            .from('workspaces')
            .select('id')
            .eq('slug', workspaceId)
            .single();

          if (!workspace) {
            // If checking a specific workspace and it's not found, return empty or error.
            // Returning empty list similar to "not a member" case for now or could be 404.
            // But since this is a filter, empty seems appropriate if filtered by invalid workspace.
            return c.json({ data: [] });
          }
          workspaceUuid = workspace.id;
        }

        if (!workspaceUuid) {
          return c.json({ data: [] });
        }
        query = query.eq('workspace_id', workspaceUuid);
      } else {
        const { data: userMemberWorkspaces } = await supabase
          .from('members')
          .select('workspace_id')
          .eq('user_id', user.id);

        const workspaceIds =
          userMemberWorkspaces?.map((m) => m.workspace_id) || [];

        if (workspaceIds.length === 0) {
          return c.json({ data: [] });
        }

        query = query.in('workspace_id', workspaceIds);
      }

      const { data, error } = await query;

      if (error) {
        return c.json({ error: error.message }, 500);
      }

      return c.json({ data });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('form', createProjectSchema),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { name, workspace_id, image, status } = c.req.valid('form');

      const { data: member } = await supabase
        .from('members')
        .select('role')
        .eq('workspace_id', workspace_id)
        .eq('user_id', user.id)
        .single();

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      let imageUrl = null;
      if (image instanceof File) {
        const fileName = `${workspace_id}/${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('workspace_image')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) return c.json({ error: error.message }, 500);

        const {
          data: { publicUrl },
        } = supabase.storage.from('workspace_image').getPublicUrl(data.path);

        imageUrl = publicUrl;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          workspace_id,
          image_url: imageUrl,
          status: status || 'ACTIVE',
        })
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 500);
      }

      return c.json({ data });
    }
  )
  .get(
    '/:projectId',
    sessionMiddleware,
    zValidator('param', z.object({ projectId: z.string() })),
    async (c) => {
      const supabase = await createSupabaseServer();
      const { projectId } = c.req.valid('param');

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        return c.json({ error: error.message }, 500);
      }

      return c.json({ data });
    }
  )
  .patch(
    '/:projectId',
    sessionMiddleware,
    zValidator('param', z.object({ projectId: z.string() })),
    zValidator('form', updateProjectSchema),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { projectId } = c.req.valid('param');
      const { name, image, status } = c.req.valid('form');

      const { data: project } = await supabase
        .from('projects')
        .select('workspace_id')
        .eq('id', projectId)
        .single();

      if (!project) return c.json({ error: 'Project not found' }, 404);

      const { data: member } = await supabase
        .from('members')
        .select('role')
        .eq('workspace_id', project.workspace_id)
        .eq('user_id', user.id)
        .single();

      if (!member) return c.json({ error: 'Unauthorized' }, 401);

      let imageUrl = undefined;
      if (image instanceof File) {
        const fileName = `${project.workspace_id}/${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('workspace_image')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) return c.json({ error: error.message }, 500);

        const {
          data: { publicUrl },
        } = supabase.storage.from('workspace_image').getPublicUrl(data.path);
        imageUrl = publicUrl;
      }

      const { data, error } = await supabase
        .from('projects')
        .update({
          name,
          status,
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) return c.json({ error: error.message }, 500);

      return c.json({ data });
    }
  )
  .delete(
    '/:projectId',
    sessionMiddleware,
    zValidator('param', z.object({ projectId: z.string() })),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { projectId } = c.req.valid('param');

      const { data: project } = await supabase
        .from('projects')
        .select('workspace_id')
        .eq('id', projectId)
        .single();

      if (!project) return c.json({ error: 'Project not found' }, 404);

      const { data: member } = await supabase
        .from('members')
        .select('role')
        .eq('workspace_id', project.workspace_id)
        .eq('user_id', user.id)
        .single();

      if (!member || member.role !== 'ADMIN') {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) return c.json({ error: error.message }, 500);

      return c.json({ data: { success: true } });
    }
  );

export default app;
