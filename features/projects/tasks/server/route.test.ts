import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';
import { TaskService } from './services';

// Mock TaskService
vi.mock('./services', () => ({
  TaskService: {
    create: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock Session Middleware
vi.mock('@/lib/session-middleware', () => ({
  sessionMiddleware: async (
    c: { set: (arg0: string, arg1: { id: string }) => void },
    next: () => void
  ) => {
    c.set('user', { id: 'user-123' });
    await next();
  },
}));

describe('Tasks Hono Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /', () => {
    it('creates a task successfully', async () => {
      const mockTask = { id: 'task-1', title: 'New Task' };

      vi.mocked(TaskService.create).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockTask as any,
      });

      const res = await app.request('/', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Task',
          description: 'Desc',
          columnId: 'col-1',
          projectId: 'proj-1',
          position: 1,
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.data).toEqual(mockTask);
    });

    it('returns error when service fails', async () => {
      vi.mocked(TaskService.create).mockResolvedValue({
        ok: false,
        error: 'Project not found',
        status: 404,
      });

      const res = await app.request('/', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Task',
          columnId: 'col-1',
          projectId: 'proj-1',
          position: 1,
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toBe('Project not found');
    });
  });

  describe('GET /:taskId', () => {
    it('returns a task successfully', async () => {
      const mockTask = { id: 'task-1', title: 'Task 1' };

      vi.mocked(TaskService.getById).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockTask as any,
      });

      const res = await app.request('/task-1');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toEqual(mockTask);
    });

    it('returns 404 when task not found', async () => {
      vi.mocked(TaskService.getById).mockResolvedValue({
        ok: false,
        error: 'Task not found',
        status: 404,
      });

      const res = await app.request('/task-1');

      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toBe('Task not found');
    });
  });

  describe('PATCH /:taskId', () => {
    it('updates task details successfully', async () => {
      const mockTask = { id: 'task-1', title: 'New Title' };

      vi.mocked(TaskService.update).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockTask as any,
      });

      const res = await app.request('/task-1', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'New Title',
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toEqual(mockTask);
    });
  });

  describe('DELETE /:taskId', () => {
    it('deletes a task successfully', async () => {
      const mockTask = { id: 'task-1' };

      vi.mocked(TaskService.delete).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockTask as any,
      });

      const res = await app.request('/task-1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toEqual(mockTask);
    });
  });
});
