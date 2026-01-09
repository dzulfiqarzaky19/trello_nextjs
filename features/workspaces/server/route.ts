import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspacesListSchema,
} from '../schema';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import { WorkspaceService } from './services';

const app = new Hono()
  .post(
    '/',
    zValidator('form', createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const supabase = await createSupabaseServer();
      const service = new WorkspaceService(supabase);
      const user = c.get('user');
      const { name, slug, image, description } = c.req.valid('form');

      try {
        let imageUrl = null;
        if (image instanceof File) {
          imageUrl = await service.uploadImage(user.id, image);
        }

        const workspace = await service.createWorkspace({
          name,
          slug,
          image_url: imageUrl,
          user_id: user.id,
          description,
        });

        try {
          await service.addMember(workspace.id, user.id, 'ADMIN');
        } catch (memberError) {
          await service.deleteWorkspace(workspace.id);
          throw memberError;
        }

        return c.json({ data: workspace });
      } catch (error: any) {
        if (error.code === '23505') {
          return c.json(
            { error: 'Workspace with this slug already exists' },
            400
          );
        }
        return c.json({ error: error.message || 'Something went wrong' }, 500);
      }
    }
  )
  .patch(
    '/:workspaceId',
    sessionMiddleware,
    zValidator('form', updateWorkspaceSchema),
    async (c) => {
      const supabase = await createSupabaseServer();
      const service = new WorkspaceService(supabase);
      const user = c.get('user');
      const { workspaceId } = c.req.param();
      const { name, slug, image, description } = c.req.valid('form');

      const member = await service.getMember(workspaceId, user.id);

      if (!member || member.role !== 'ADMIN') {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const existingImageUrl = (member.workspaces as any)?.image_url;
      let imageUrl: string | undefined | null = undefined;

      try {
        if (image instanceof File) {
          imageUrl = await service.uploadImage(user.id, image);
        } else if (typeof image === 'string') {
          imageUrl = image;
        } else if (image === null) {
          imageUrl = null;
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug;
        if (description !== undefined) updateData.description = description;
        if (imageUrl !== undefined) updateData.image_url = imageUrl;

        const data = await service.updateWorkspace(workspaceId, updateData);

        if (
          imageUrl !== undefined &&
          existingImageUrl &&
          existingImageUrl !== imageUrl
        ) {
          await service.deleteImage(existingImageUrl);
        }

        return c.json({ data });
      } catch (error: any) {
        if (error.code === '23505') {
          return c.json(
            { error: 'Workspace with this slug already exists' },
            400
          );
        }
        return c.json({ error: error.message || 'Something went wrong' }, 500);
      }
    }
  )
  .delete('/:workspaceId', sessionMiddleware, async (c) => {
    const supabase = await createSupabaseServer();
    const service = new WorkspaceService(supabase);
    const user = c.get('user');
    const { workspaceId } = c.req.param();

    const member = await service.getMember(workspaceId, user.id);

    if (!member || member.role !== 'ADMIN') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const imageUrl = (member.workspaces as any)?.image_url;

    try {
      if (imageUrl) {
        await service.deleteImage(imageUrl);
      }

      await service.deleteWorkspace(workspaceId);
      return c.json({ data: { id: workspaceId } });
    } catch (error: any) {
      return c.json({ error: error.message || 'Something went wrong' }, 500);
    }
  })
  .get('/', sessionMiddleware, async (c) => {
    const supabase = await createSupabaseServer();
    const service = new WorkspaceService(supabase);
    const user = c.get('user');

    try {
      const data = await service.listWorkspaces(user.id);
      const result = workspacesListSchema.safeParse(data);

      if (!result.success) {
        return c.json({ error: 'Data validation failed' }, 500);
      }

      return c.json({ workspaces: result.data });
    } catch (error: any) {
      return c.json({ error: 'Something went wrong' }, 500);
    }
  })
  .post('/upload', sessionMiddleware, async (c) => {
    const supabase = await createSupabaseServer();
    const service = new WorkspaceService(supabase);
    const user = c.get('user');

    const body = await c.req.parseBody();
    const file = body['file'] as File;

    if (!file) return c.json({ error: 'No file uploaded' }, 400);

    try {
      const url = await service.uploadImage(user.id, file);
      return c.json({ url });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  });

export default app;
