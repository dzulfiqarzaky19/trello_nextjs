import 'server-only';

import { createMiddleware } from 'hono/factory';
import { createSupabaseServer } from './supabase/server';
import { getCookie } from 'hono/cookie';
import { User } from '@supabase/supabase-js';

type AdditionalContext = {
  Variables: {
    user: User;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const supabase = await createSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    c.set('user', user);

    await next();
  }
);
