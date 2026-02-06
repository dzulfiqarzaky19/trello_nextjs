import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { signInSchema, signUpSchema } from '../schema';
import { createSupabaseServer } from '@/lib/supabase/server';

const app = new Hono()
  .post('/login', zValidator('json', signInSchema), async (c) => {
    const supabase = await createSupabaseServer();
    const { email, password } = c.req.valid('json');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return c.json({ error: error.message }, 401);
      }

      return c.json({ response: data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'My Internal Server Error';
      return c.json({ error: errorMessage }, 500);
    }
  })
  .post('/register', zValidator('json', signUpSchema), async (c) => {
    const supabase = await createSupabaseServer();
    const { email, password, fullName } = c.req.valid('json');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
          },
        },
      });

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        return c.json({ response: session });
      }

      return c.json({ response: 'Account created. Please log in.' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';
      return c.json({ error: errorMessage }, 500);
    }
  })
  .post('/logout', async (c) => {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
    return c.json({ success: true });
  })
  .get('/me', async (c) => {
    const supabase = await createSupabaseServer();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return c.json({ error: 'User not found' }, 401);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return c.json({ error: 'Profile not found' }, 404);
      }

      return c.json({ user, profile });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';
      return c.json({ error: errorMessage }, 500);
    }
  })
  .get('/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
    const supabase = await createSupabaseServer();
    const { id } = c.req.valid('param');

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ profile });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';
      return c.json({ error: errorMessage }, 500);
    }
  });

export default app;
