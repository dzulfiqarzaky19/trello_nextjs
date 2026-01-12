import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import { userSearchResponseSchema } from '../schema';

const app = new Hono().get(
  '/search',
  sessionMiddleware,
  zValidator('query', z.object({ q: z.string().min(2) })),
  async (c) => {
    const supabase = await createSupabaseServer();
    const user = c.get('user');
    const { q } = c.req.valid('query');

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
      .neq('id', user.id)
      .limit(10);

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    const result = userSearchResponseSchema.safeParse({ data: data || [] });

    if (!result.success) {
      return c.json({ error: 'Data validation failed' }, 500);
    }

    return c.json(result.data);
  }
);

export default app;
