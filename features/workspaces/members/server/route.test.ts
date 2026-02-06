import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { MemberService } from './services';
import memberApp from './route';

// Mock MemberService
vi.mock('./services', () => ({
  MemberService: {
    list: vi.fn(),
    add: vi.fn(),
    updateRole: vi.fn(),
    remove: vi.fn(),
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

describe('Member Routes', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono().route('/', memberApp);
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return member list on success', async () => {
      const mockData = {
        members: [],
        isAdmin: true,
        currentUserId: 'user-123',
        workspaceId: 'workspace-123',
      };

      vi.mocked(MemberService.list).mockResolvedValue({
        ok: true,
        data: mockData,
      });

      const res = await app.request('/?workspaceId=workspace-123');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ data: mockData });
    });

    it('should return error on service failure', async () => {
      vi.mocked(MemberService.list).mockResolvedValue({
        ok: false,
        error: 'Unauthorized',
        status: 401,
      });

      const res = await app.request('/?workspaceId=workspace-123');
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('POST /', () => {
    it('should add member successfully', async () => {
      vi.mocked(MemberService.add).mockResolvedValue({
        ok: true,
        data: { success: true },
      });

      const res = await app.request('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: 'workspace-123',
          userId: '123e4567-e89b-12d3-a456-426614174000',
          role: 'MEMBER',
        }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true });
    });
  });

  describe('PATCH /:userId', () => {
    it('should update member role successfully', async () => {
      vi.mocked(MemberService.updateRole).mockResolvedValue({
        ok: true,
        data: { success: true },
      });

      const res = await app.request('/123e4567-e89b-12d3-a456-426614174000', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: 'workspace-123',
          role: 'ADMIN',
        }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true });
    });
  });

  describe('DELETE /:userId', () => {
    it('should remove member successfully', async () => {
      vi.mocked(MemberService.remove).mockResolvedValue({
        ok: true,
        data: { success: true },
      });

      const res = await app.request('/123e4567-e89b-12d3-a456-426614174000', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: 'workspace-123',
        }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true });
    });
  });
});
