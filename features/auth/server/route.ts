import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { signInSchema, signUpSchema } from '../schemas';
import { createSupabaseClient } from '@/lib/supabase/client';

const app = new Hono()
  .post('/login', zValidator('json', signInSchema), async (c) => {
    const supabase = createSupabaseClient();
    const { email, password } = c.req.valid('json');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return c.json({ email, password });
  })
  .post('/register', zValidator('json', signUpSchema), async (c) => {
    const { email, password, fullName, confirmPassword } = c.req.valid('json');

    return c.json({ email, password, fullName, confirmPassword });
  });

export default app;
