import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';

const mockRemove = vi.fn();
const mockUpload = vi.fn();

const createChain = (finalResult = { data: null, error: null }) => {
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve(finalResult)),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    then: (resolve: any) => Promise.resolve(finalResult).then(resolve),
  };
  return chain;
};

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: vi.fn(),
}));

import { createSupabaseServer } from '@/lib/supabase/server';

vi.mock('@/lib/session-middleware', () => ({
  sessionMiddleware: async (c: any, next: any) => {
    c.set('user', { id: 'test-user-id', email: 'test@example.com' });
    await next();
  },
}));

describe('Workspaces Hono Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRemove.mockResolvedValue({ error: null });
    mockUpload.mockResolvedValue({ data: { path: 'test-path' }, error: null });
  });

  const setupSupabaseMock = (results: any[]) => {
    let callCount = 0;
    (createSupabaseServer as any).mockImplementation(async () => ({
      from: vi.fn(() => {
        const res = results[callCount++] || { data: null, error: null };
        const chain = createChain(res);
        return chain;
      }),
      storage: {
        from: vi.fn(() => ({
          remove: mockRemove,
          getPublicUrl: vi.fn(() => ({
            data: { publicUrl: 'http://example.com/workspace_image/mock.png' },
          })),
          upload: mockUpload,
        })),
      },
    }));
  };

  const mockWorkspace = {
    id: 'ws-1',
    name: 'Workspace 1',
    slug: 'ws-1',
    image_url: 'http://example.com/workspace_image/old.png',
    user_id: 'test-user-id',
    user: {
      id: 'test-user-id',
      full_name: 'Test User',
      avatar_url: 'http://example.com/avatar.png',
      email: 'test@example.com',
    },
    invite_code: 'invite-code-1',
    created_at: '2023-01-01',
    updated_at: null,
    members: [
      {
        user_id: 'test-user-id',
        profiles: {
          id: 'test-user-id',
          full_name: 'Test User',
          avatar_url: 'http://example.com/avatar.png',
          email: 'test@example.com',
        },
      },
    ],
  };

  describe('GET /', () => {
    it('returns a list of workspaces', async () => {
      setupSupabaseMock([{ data: [mockWorkspace], error: null }]);

      const res = await app.request('/');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.workspaces).toHaveLength(1);
    });
  });

  describe('POST /', () => {
    it('successfully creates a workspace', async () => {
      setupSupabaseMock([
        { data: mockWorkspace, error: null },
        { error: null },
      ]);

      const formData = new FormData();
      formData.append('name', 'New Workspace');
      formData.append('slug', 'new-slug');

      const res = await app.request('/', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /:workspaceId', () => {
    it('updates workspace and cleans up image', async () => {
      setupSupabaseMock([
        {
          data: {
            role: 'ADMIN',
            workspaces: {
              image_url: 'http://example.com/workspace_image/old.png',
            },
          },
          error: null,
        },
        { data: mockWorkspace, error: null },
      ]);

      const formData = new FormData();
      formData.append('name', 'Updated');
      formData.append('image', 'http://example.com/workspace_image/new.png');

      const res = await app.request('/ws-1', {
        method: 'PATCH',
        body: formData,
      });

      expect(res.status).toBe(200);
      expect(mockRemove).toHaveBeenCalled();
    });

    it('returns 401 if not admin', async () => {
      setupSupabaseMock([{ data: { role: 'MEMBER' }, error: null }]);

      const res = await app.request('/ws-1', {
        method: 'PATCH',
        body: new URLSearchParams({ name: 'Fail' }),
      });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /:workspaceId', () => {
    it('deletes workspace and cleans up image', async () => {
      setupSupabaseMock([
        {
          data: {
            role: 'ADMIN',
            workspaces: {
              image_url: 'http://example.com/workspace_image/old.png',
            },
          },
          error: null,
        },
        { error: null },
      ]);

      const res = await app.request('/ws-1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      expect(mockRemove).toHaveBeenCalled();
    });

    it('returns 401 if not admin', async () => {
      setupSupabaseMock([{ data: { role: 'MEMBER' }, error: null }]);

      const res = await app.request('/ws-1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(401);
    });
  });
});
