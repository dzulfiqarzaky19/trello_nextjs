import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { signInSchema, signUpSchema } from '../schemas';
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
        return c.json({ error: error.message });
      }

      return c.json({ response: data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'My Internal Server Error';
      return c.json({ error: errorMessage });
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
        return c.json({ error: error.message });
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
        error instanceof Error ? error.message : 'My Internal Server Error';
      return c.json({ error: errorMessage });
    }
  })
  .post('/logout', async (c) => {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
    return c.json({ success: true });
  });

export default app;
