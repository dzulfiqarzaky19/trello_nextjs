import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';
import { UserService } from './services';

vi.mock('./services', () => ({
  UserService: {
    search: vi.fn(),
  },
}));

vi.mock('@/lib/session-middleware', () => ({
  sessionMiddleware: async (
    c: { set: (key: string, value: { id: string; email: string }) => void },
    next: () => Promise<void>
  ) => {
    c.set('user', { id: 'test-user-id', email: 'test@example.com' });
    await next();
  },
}));

describe('Users Hono Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSearchResults = {
    data: [
      {
        id: 'user-1',
        email: 'john@example.com',
        full_name: 'John Doe',
        avatar_url: 'http://example.com/john.png',
      },
      {
        id: 'user-2',
        email: 'jane@example.com',
        full_name: 'Jane Smith',
        avatar_url: null,
      },
    ],
  };

  describe('GET /search', () => {
    it('returns search results successfully', async () => {
      vi.mocked(UserService.search).mockResolvedValue({
        ok: true,
        data: mockSearchResults,
      });

      const res = await app.request('/search?q=john');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(UserService.search).toHaveBeenCalledWith('john', 'test-user-id');
    });

    it('returns empty array when no results found', async () => {
      vi.mocked(UserService.search).mockResolvedValue({
        ok: true,
        data: { data: [] },
      });

      const res = await app.request('/search?q=nonexistent');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(0);
    });

    it('returns 400 when query is too short', async () => {
      const res = await app.request('/search?q=a');

      expect(res.status).toBe(400);
    });

    it('returns 400 when query is missing', async () => {
      const res = await app.request('/search');

      expect(res.status).toBe(400);
    });

    it('returns error when service fails', async () => {
      vi.mocked(UserService.search).mockResolvedValue({
        ok: false,
        error: 'Database error',
        status: 500,
      });

      const res = await app.request('/search?q=test');
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.error).toBe('Database error');
    });
  });
});
