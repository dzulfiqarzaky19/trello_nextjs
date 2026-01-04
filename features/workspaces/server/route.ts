import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspacesListSchema,
} from '../schema';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';

const app = new Hono()
  .post(
    '/',
    zValidator('form', createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { name, slug, image, description } = c.req.valid('form');

      let imageUrl = null;
      if (image instanceof File) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
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

      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name,
          slug,
          image_url: imageUrl,
          user_id: user.id,
          description,
        })
        .select()
        .single();

      if (workspaceError) {
        if (workspaceError.code === '23505') {
          return c.json(
            { error: 'Workspace with this slug already exists' },
            400
          );
        }
        return c.json({ error: 'Something went wrong' }, 500);
      }

      const { error: memberError } = await supabase.from('members').insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'ADMIN',
      });

      if (memberError) {
        await supabase.from('workspaces').delete().eq('id', workspace.id);
        return c.json({ error: 'Something went wrong' }, 500);
      }

      return c.json({ data: workspace });
    }
  )
  .patch(
    '/:workspaceId',
    sessionMiddleware,
    zValidator('form', updateWorkspaceSchema),
    async (c) => {
      const supabase = await createSupabaseServer();
      const user = c.get('user');
      const { workspaceId } = c.req.param();
      const { name, slug, image, description } = c.req.valid('form');

      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('role, workspaces(image_url)')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();

      if (memberError || member?.role !== 'ADMIN') {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const existingImageUrl = (member.workspaces as any)?.image_url;
      let imageUrl: string | undefined | null = undefined;

      if (image instanceof File) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
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
      } else if (typeof image === 'string') {
        imageUrl = image;
      } else if (image === null) {
        imageUrl = null;
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;

      if (imageUrl !== undefined) {
        updateData.image_url = imageUrl;
      }

      const { data, error } = await supabase
        .from('workspaces')
        .update(updateData)
        .eq('id', workspaceId)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return c.json(
            { error: 'Workspace with this slug already exists' },
            400
          );
        }
        return c.json({ error: 'Something went wrong' }, 500);
      }

      if (
        imageUrl !== undefined &&
        existingImageUrl &&
        existingImageUrl !== imageUrl
      ) {
        const parts = existingImageUrl.split('workspace_image/');
        if (parts.length > 1) {
          const path = parts[parts.length - 1];
          await supabase.storage.from('workspace_image').remove([path]);
        }
      }

      return c.json({ data });
    }
  )
  .delete('/:workspaceId', sessionMiddleware, async (c) => {
    const supabase = await createSupabaseServer();
    const user = c.get('user');
    const { workspaceId } = c.req.param();

    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('role, workspaces(image_url)')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();

    if (memberError || member?.role !== 'ADMIN') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const imageUrl = (member.workspaces as any)?.image_url;

    if (imageUrl) {
      const parts = imageUrl.split('workspace_image/');
      if (parts.length > 1) {
        const path = parts[parts.length - 1];
        await supabase.storage.from('workspace_image').remove([path]);
      }
    }

    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId);

    if (error) {
      return c.json({ error: 'Something went wrong' }, 500);
    }

    return c.json({ data: { id: workspaceId } });
  })
  .get('/', sessionMiddleware, async (c) => {
    const supabase = await createSupabaseServer();
    const user = c.get('user');

    const { data, error } = await supabase
      .from('workspaces')
      .select(
        `
          *,
          user:profiles!user_id (
            id,
            full_name,
            avatar_url
          ),
          members!inner (
            user_id,
            role,
            profiles!user_id (
              id,
              full_name,
              avatar_url
            )
          )
        `
      )
      .eq('members.user_id', user.id);

    if (error) {
      return c.json({ error: 'Something went wrong' }, 500);
    }

    const result = workspacesListSchema.safeParse(data);

    if (!result.success) {
      return c.json({ error: 'Data validation failed' }, 500);
    }

    return c.json({ workspaces: result.data });
  })
  .post('/upload', sessionMiddleware, async (c) => {
    const supabase = await createSupabaseServer();
    const user = c.get('user');

    const body = await c.req.parseBody();
    const file = body['file'] as File;

    if (!file) return c.json({ error: 'No file uploaded' }, 400);

    const fileName = `${user.id}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('workspace_image')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) return c.json({ error: error.message }, 500);

    const {
      data: { publicUrl },
    } = supabase.storage.from('workspace_image').getPublicUrl(data.path);

    return c.json({ url: publicUrl });
  });

export default app;
