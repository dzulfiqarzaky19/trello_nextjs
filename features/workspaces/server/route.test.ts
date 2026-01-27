import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';
import { WorkspaceService } from './services';

vi.mock('./services', () => ({
  WorkspaceService: {
    getById: vi.fn(),
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    uploadImage: vi.fn(),
  },
}));

vi.mock('@/lib/session-middleware', () => ({
  sessionMiddleware: async (c: { set: (key: string, value: { id: string; email: string }) => void }, next: () => Promise<void>) => {
    c.set('user', { id: 'test-user-id', email: 'test@example.com' });
    await next();
  },
}));

describe('Workspaces Hono Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
      role: 'ADMIN' as const,
      email: 'test@example.com',
    },
    invite_code: 'invite-code-1',
    created_at: '2023-01-01',
    updated_at: null,
    description: undefined,
    members: [
      {
        user_id: 'test-user-id',
        role: 'ADMIN' as const,
        profiles: {
          id: 'test-user-id',
          full_name: 'Test User',
          avatar_url: 'http://example.com/avatar.png',
          email: 'test@example.com',
        },
      },
    ],
    projects: [],
    isAdmin: true,
    currentUserId: 'test-user-id',
  };

  describe('GET /', () => {
    it('returns a list of workspaces', async () => {
      vi.mocked(WorkspaceService.list).mockResolvedValue({
        ok: true,
        data: [mockWorkspace],
      });

      const res = await app.request('/');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.workspaces).toHaveLength(1);
      expect(WorkspaceService.list).toHaveBeenCalledWith('test-user-id');
    });

    it('returns error when service fails', async () => {
      vi.mocked(WorkspaceService.list).mockResolvedValue({
        ok: false,
        error: 'Database error',
        status: 500,
      });

      const res = await app.request('/');
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.error).toBe('Database error');
    });
  });

  describe('GET /:workspaceId', () => {
    it('returns a workspace by id', async () => {
      vi.mocked(WorkspaceService.getById).mockResolvedValue({
        ok: true,
        data: mockWorkspace,
      });

      const res = await app.request('/ws-1');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data.id).toBe('ws-1');
      expect(WorkspaceService.getById).toHaveBeenCalledWith('ws-1', 'test-user-id');
    });

    it('returns 404 when workspace not found', async () => {
      vi.mocked(WorkspaceService.getById).mockResolvedValue({
        ok: false,
        error: 'Workspace not found',
        status: 404,
      });

      const res = await app.request('/not-found');
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.error).toBe('Workspace not found');
    });

    it('returns 401 when unauthorized', async () => {
      vi.mocked(WorkspaceService.getById).mockResolvedValue({
        ok: false,
        error: 'Unauthorized',
        status: 401,
      });

      const res = await app.request('/ws-1');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('successfully creates a workspace', async () => {
      vi.mocked(WorkspaceService.create).mockResolvedValue({
        ok: true,
        data: { id: 'new-ws', name: 'New Workspace', slug: 'new-slug' },
      });

      const formData = new FormData();
      formData.append('name', 'New Workspace');
      formData.append('slug', 'new-slug');

      const res = await app.request('/', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(200);
      expect(WorkspaceService.create).toHaveBeenCalledWith({
        name: 'New Workspace',
        slug: 'new-slug',
        description: undefined,
        image: null,
        userId: 'test-user-id',
      });
    });

    it('returns 400 when slug already exists', async () => {
      vi.mocked(WorkspaceService.create).mockResolvedValue({
        ok: false,
        error: 'Workspace with this slug already exists',
        status: 400,
      });

      const formData = new FormData();
      formData.append('name', 'Duplicate');
      formData.append('slug', 'existing-slug');

      const res = await app.request('/', {
        method: 'POST',
        body: formData,
      });
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toBe('Workspace with this slug already exists');
    });
  });

  describe('PATCH /:workspaceId', () => {
    it('updates workspace successfully', async () => {
      vi.mocked(WorkspaceService.update).mockResolvedValue({
        ok: true,
        data: { id: 'ws-1', name: 'Updated', slug: 'ws-1' },
      });

      const formData = new FormData();
      formData.append('name', 'Updated');

      const res = await app.request('/ws-1', {
        method: 'PATCH',
        body: formData,
      });

      expect(res.status).toBe(200);
      expect(WorkspaceService.update).toHaveBeenCalledWith(
        'ws-1',
        'test-user-id',
        { name: 'Updated', slug: undefined, description: undefined, image: undefined }
      );
    });

    it('returns 401 if not admin', async () => {
      vi.mocked(WorkspaceService.update).mockResolvedValue({
        ok: false,
        error: 'Unauthorized',
        status: 401,
      });

      const formData = new FormData();
      formData.append('name', 'Fail');

      const res = await app.request('/ws-1', {
        method: 'PATCH',
        body: formData,
      });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /:workspaceId', () => {
    it('deletes workspace successfully', async () => {
      vi.mocked(WorkspaceService.delete).mockResolvedValue({
        ok: true,
        data: { id: 'ws-1' },
      });

      const res = await app.request('/ws-1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      expect(WorkspaceService.delete).toHaveBeenCalledWith('ws-1', 'test-user-id');
    });

    it('returns 401 if not admin', async () => {
      vi.mocked(WorkspaceService.delete).mockResolvedValue({
        ok: false,
        error: 'Unauthorized',
        status: 401,
      });

      const res = await app.request('/ws-1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /upload', () => {
    it.skip('uploads image successfully', async () => {
      vi.mocked(WorkspaceService.uploadImage).mockResolvedValue({
        ok: true,
        data: { url: 'http://example.com/uploaded.png' },
      });

      const formData = new FormData();
      const blob = new Blob(['test'], { type: 'image/png' });
      const file = new File([blob], 'test.png', { type: 'image/png' });
      formData.append('file', file);

      const res = await app.request('/upload', {
        method: 'POST',
        body: formData,
      });
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.url).toBe('http://example.com/uploaded.png');
    });

    it('returns 400 when no file provided', async () => {
      const formData = new FormData();

      const res = await app.request('/upload', {
        method: 'POST',
        body: formData,
      });
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toBe('No file uploaded');
    });
  });
});
