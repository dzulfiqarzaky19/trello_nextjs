import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createWorkspaceSchema, updateWorkspaceSchema } from '../schema';
import { sessionMiddleware } from '@/lib/session-middleware';
import { WorkspaceService } from './services';

const app = new Hono()
  .get(
    '/:workspaceId',
    sessionMiddleware,
    zValidator('param', z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const { workspaceId } = c.req.valid('param');

      const result = await WorkspaceService.getById(workspaceId, user.id);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }
      return c.json({ data: result.data });
    }
  )
  .get('/', sessionMiddleware, async (c) => {
    const user = c.get('user');

    const result = await WorkspaceService.list(user.id);

    if (!result.ok) {
      return c.json({ error: result.error }, result.status);
    }
    return c.json({ workspaces: result.data });
  })
  .post(
    '/',
    zValidator('form', createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get('user');
      const { name, slug, image, description } = c.req.valid('form');

      const result = await WorkspaceService.create({
        name,
        slug,
        description,
        image: image instanceof File ? image : null,
        userId: user.id,
      });

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }
      return c.json({ data: result.data });
    }
  )
  .patch(
    '/:workspaceId',
    sessionMiddleware,
    zValidator('form', updateWorkspaceSchema),
    async (c) => {
      const user = c.get('user');
      const { workspaceId } = c.req.param();
      const { name, slug, image, description } = c.req.valid('form');

      const result = await WorkspaceService.update(workspaceId, user.id, {
        name,
        slug,
        description,
        image,
      });

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }
      return c.json({ data: result.data });
    }
  )
  .delete('/:workspaceId', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const { workspaceId } = c.req.param();

    const result = await WorkspaceService.delete(workspaceId, user.id);

    if (!result.ok) {
      return c.json({ error: result.error }, result.status);
    }
    return c.json({ data: result.data });
  })
  .post('/upload', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    const result = await WorkspaceService.uploadImage(user.id, file);

    if (!result.ok) {
      return c.json({ error: result.error }, result.status);
    }
    return c.json({ url: result.data.url });
  });

export default app;
