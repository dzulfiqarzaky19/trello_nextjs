import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';
import { ProjectService } from './services';

// Mock ProjectService
vi.mock('./services', () => ({
  ProjectService: {
    list: vi.fn(),
    create: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock session middleware
vi.mock('@/lib/session-middleware', () => ({
  sessionMiddleware: async (
    c: { set: (arg0: string, arg1: { id: string }) => void },
    next: () => void
  ) => {
    c.set('user', { id: 'user-123' });
    await next();
  },
}));

describe('Projects Hono Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('returns projects filtered by workspaceId', async () => {
      const mockResult = {
        projects: [{ id: 'p1', name: 'Project 1', workspace_id: 'ws-1' }],
        isAdmin: true,
        workspaceId: 'ws-1',
      };

      vi.mocked(ProjectService.list).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockResult as any,
      });

      const res = await app.request('/?workspaceId=ws-1');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toEqual(mockResult);
      expect(ProjectService.list).toHaveBeenCalledWith('user-123', 'ws-1');
    });

    it('returns error when service fails', async () => {
      vi.mocked(ProjectService.list).mockResolvedValue({
        ok: false,
        error: 'Service error',
        status: 500,
      });

      const res = await app.request('/');
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Service error' });
    });
  });

  describe('POST /', () => {
    it('creates a project successfully', async () => {
      const mockProject = {
        id: 'p1',
        name: 'New Project',
        workspace_id: 'ws-1',
        status: 'ACTIVE',
      };

      vi.mocked(ProjectService.create).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockProject as any,
      });

      const formData = new FormData();
      formData.append('name', 'New Project');
      formData.append('workspace_id', 'ws-1');

      const res = await app.request('/', {
        method: 'POST',
        body: formData,
      });

      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toEqual(mockProject);
      expect(ProjectService.create).toHaveBeenCalled();
    });
  });

  describe('GET /:projectId', () => {
    it('returns a project by id', async () => {
      const mockProject = {
        id: 'p1',
        name: 'Project 1',
      };

      vi.mocked(ProjectService.getById).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockProject as any,
      });

      const res = await app.request('/p1');
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ data: mockProject });
      expect(ProjectService.getById).toHaveBeenCalledWith('p1', 'user-123');
    });

    it('returns 404 when project not found', async () => {
      vi.mocked(ProjectService.getById).mockResolvedValue({
        ok: false,
        error: 'Project not found',
        status: 404,
      });

      const res = await app.request('/p1');
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /:projectId', () => {
    it('updates project successfully', async () => {
      const mockProject = {
        id: 'p1',
        name: 'Updated Project',
      };

      vi.mocked(ProjectService.update).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockProject as any,
      });

      const formData = new FormData();
      formData.append('name', 'Updated Project');

      const res = await app.request('/p1', {
        method: 'PATCH',
        body: formData,
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ data: mockProject });
      expect(ProjectService.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /:projectId', () => {
    it('deletes project successfully', async () => {
      vi.mocked(ProjectService.delete).mockResolvedValue({
        ok: true,
        data: { success: true },
      });

      const res = await app.request('/p1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ data: { success: true } });
      expect(ProjectService.delete).toHaveBeenCalledWith('p1', 'user-123');
    });
  });
});
