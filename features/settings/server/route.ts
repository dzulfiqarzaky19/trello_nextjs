import { Hono } from 'hono';
import { profileSchema, securitySchema } from '../schema';
import { zValidator } from '@hono/zod-validator';
import { sessionMiddleware } from '@/lib/session-middleware';
import { SettingsService } from './services';

const app = new Hono()
  .post(
    '/security',
    zValidator('json', securitySchema),
    sessionMiddleware,
    async (c) => {
      const { currentPassword, newPassword } = c.req.valid('json');
      const user = c.get('user');

      const result = await SettingsService.changePassword({
        email: user.email!,
        currentPassword,
        newPassword,
      });

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ response: result.data.message });
    }
  )
  .put(
    '/profile',
    zValidator('json', profileSchema),
    sessionMiddleware,
    async (c) => {
      const { fullName, role, bio } = c.req.valid('json');
      const user = c.get('user');

      const result = await SettingsService.updateProfile({
        userId: user.id,
        fullName,
        role,
        bio,
      });

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ response: result.data.message });
    }
  );

export default app;
