import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createWorkspaceSchema, workspacesListSchema } from '../schema';
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
      const { name, slug, image } = c.req.valid('form');

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
  .get('/', sessionMiddleware, async (c) => {
    const supabase = await createSupabaseServer();
    const user = c.get('user');

    const { data, error } = await supabase
      .from('workspaces')
      .select(`*, members!inner(user_id)`)
      .eq('members.user_id', user.id);

    if (error) {
      console.error('Supabase Error:', error);
      return c.json({ error: 'Something went wrong' }, 500);
    }

    console.log({ data });

    const result = workspacesListSchema.safeParse(data);

    if (!result.success) {
      console.error('Zod Validation Error:', result.error);
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
