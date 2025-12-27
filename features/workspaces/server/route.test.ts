import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';

const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockEq = vi.fn();
const mockDelete = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: vi.fn(async () => ({
    from: vi.fn((table) => ({
      insert: mockInsert,
      select: mockSelect,
      eq: mockEq,
      delete: mockDelete,
      single: mockSingle,
    })),
  })),
}));

vi.mock('@/lib/session-middleware', () => ({
  sessionMiddleware: async (c: any, next: any) => {
    c.set('user', { id: 'test-user-id', email: 'test@example.com' });
    await next();
  },
}));

describe('Workspaces Hono Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle, eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  describe('GET /', () => {
    it('returns a list of workspaces for the user', async () => {
      const mockWorkspaces = [
        {
          id: 'ws-1',
          name: 'Workspace 1',
          slug: 'ws-1',
          image_url: null,
          user_id: 'test-user-id',
          members: [{ user_id: 'test-user-id' }],
          created_at: '2023-01-01',
          updated_at: null,
        },
      ];

      mockSelect.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockWorkspaces, error: null }),
      });

      const res = await app.request('/');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.workspaces).toHaveLength(1);
      expect(body.workspaces[0].name).toBe('Workspace 1');
    });

    it('returns 500 if Supabase fetch fails', async () => {
      mockSelect.mockReturnValue({
        eq: vi
          .fn()
          .mockResolvedValue({ data: null, error: { message: 'Fetch error' } }),
      });

      const res = await app.request('/');
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.error).toBe('Something went wrong');
    });
  });

  describe('POST /', () => {
    const validPayload = {
      name: 'New Workspace',
      slug: 'new-ws',
      image: 'https://example.com/img.png',
    };

    it('successfully creates a workspace and an admin member', async () => {
      const mockWorkspace = {
        id: 'new-ws-id',
        ...validPayload,
        user_id: 'test-user-id',
      };

      mockSingle.mockResolvedValueOnce({ data: mockWorkspace, error: null });

      mockInsert
        .mockReturnValueOnce({ select: mockSelect })
        .mockResolvedValueOnce({ error: null });

      const formData = new FormData();
      formData.append('name', validPayload.name);
      formData.append('slug', validPayload.slug);
      formData.append('image', validPayload.image);

      const res = await app.request('/', {
        method: 'POST',
        body: formData,
      });

      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data.name).toBe('New Workspace');
    });

    it('returns 400 if slug already exists', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: '23505' },
      });

      const formData = new FormData();
      formData.append('name', validPayload.name);
      formData.append('slug', validPayload.slug);
      formData.append('image', validPayload.image);

      const res = await app.request('/', {
        method: 'POST',
        body: formData,
      });

      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toBe('Workspace with this slug already exists');
    });

    it('rolls back workspace creation if member creation fails', async () => {
      const mockWorkspace = {
        id: 'new-ws-id',
        ...validPayload,
        user_id: 'test-user-id',
      };

      mockSingle.mockResolvedValueOnce({ data: mockWorkspace, error: null });
      mockInsert
        .mockReturnValueOnce({ select: mockSelect }) // workspace
        .mockResolvedValueOnce({ error: { message: 'Member error' } }); // member

      mockDelete.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const formData = new FormData();
      formData.append('name', validPayload.name);
      formData.append('slug', validPayload.slug);
      formData.append('image', validPayload.image);

      const res = await app.request('/', {
        method: 'POST',
        body: formData,
      });

      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.error).toBe('Something went wrong');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('returns 400 if validation fails', async () => {
      const formData = new FormData();
      formData.append('name', 'ab');

      const res = await app.request('/', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(400);
    });
  });
});
