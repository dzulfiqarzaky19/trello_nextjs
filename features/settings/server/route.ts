import { Hono } from 'hono';
import { securitySchema } from '../schema';
import { zValidator } from '@hono/zod-validator';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';

const app = new Hono().post(
  '/security',
  zValidator('json', securitySchema),
  sessionMiddleware,
  async (c) => {
    const { currentPassword, newPassword } = c.req.valid('json');
    const user = c.get('user');
    const supabase = await createSupabaseServer();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return c.json({ error: 'Incorrect current password' }, 401);
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return c.json({ error: updateError.message }, 401);
    }

    return c.json({ response: 'Password updated successfully' });
  }
);

export default app;
