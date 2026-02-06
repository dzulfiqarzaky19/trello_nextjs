import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';
import { ColumnService } from './services';

// Mock ColumnService
vi.mock('./services', () => ({
  ColumnService: {
    list: vi.fn(),
    create: vi.fn(),
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

describe('Columns Hono Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('returns a list of columns successfully', async () => {
      const mockColumns = [{ id: 'col-1', name: 'Column 1', tasks: [] }];

      vi.mocked(ColumnService.list).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockColumns as any,
      });

      const res = await app.request('/?projectId=proj-1');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toEqual(mockColumns);
    });

    it('returns error when service fails', async () => {
      vi.mocked(ColumnService.list).mockResolvedValue({
        ok: false,
        error: 'Project not found',
        status: 404,
      });

      const res = await app.request('/?projectId=proj-1');

      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toBe('Project not found');
    });
  });

  describe('POST /', () => {
    it('creates a column successfully', async () => {
      const mockColumn = { id: 'col-1', name: 'New Column' };

      vi.mocked(ColumnService.create).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockColumn as any,
      });

      const res = await app.request('/', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Column',
          projectId: 'proj-1',
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.data).toEqual(mockColumn);
    });
  });

  describe('PATCH /:columnId', () => {
    it('updates column details successfully', async () => {
      const mockColumn = { id: 'col-1', name: 'Updated Title' };

      vi.mocked(ColumnService.update).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockColumn as any,
      });

      const res = await app.request('/col-1', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'Updated Title',
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toEqual(mockColumn);
    });
  });

  describe('DELETE /:columnId', () => {
    it('deletes a column successfully', async () => {
      const mockColumn = { id: 'col-1' };

      vi.mocked(ColumnService.delete).mockResolvedValue({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: mockColumn as any,
      });

      const res = await app.request('/col-1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toEqual(mockColumn);
    });
  });
});
