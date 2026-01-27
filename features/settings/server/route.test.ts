import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';

const mockSignIn = vi.fn();
const mockUpdateUser = vi.fn();
const mockUpdateTable = vi.fn().mockReturnValue({
  eq: vi.fn().mockResolvedValue({ error: null }),
});

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: vi.fn(async () => ({
    auth: {
      signInWithPassword: mockSignIn,
      updateUser: mockUpdateUser,
    },
    from: vi.fn(() => ({
      update: mockUpdateTable,
    })),
  })),
}));

vi.mock('@/lib/session-middleware', () => ({
  sessionMiddleware: async (c: any, next: any) => {
    c.set('user', { id: 'test-user-id', email: 'test@example.com' });
    await next();
  },
}));

describe('Settings Hono Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /security', () => {
    it('returns 200 when both password verification and update succeed', async () => {
      mockSignIn.mockResolvedValue({ error: null });
      mockUpdateUser.mockResolvedValue({ error: null });

      const res = await app.request('/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: 'old-password',
          newPassword: 'new-password-secure',
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.response).toBe('Password updated successfully');
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'old-password',
      });
    });

    it('returns 401 if the current password is incorrect', async () => {
      mockSignIn.mockResolvedValue({
        error: { message: 'Invalid login credentials' },
      });

      const res = await app.request('/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: 'wrong-password',
          newPassword: 'new-password-secure',
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(401);
      expect(body.error).toBe('Incorrect current password');
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });
  });

  describe('PUT /profile', () => {
    it('updates the profile and returns 200', async () => {
      const payload = {
        fullName: 'John Doe',
        role: 'Engineer',
        bio: 'Hello world',
      };

      const res = await app.request('/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.response).toBe('Profile updated successfully');
      expect(mockUpdateTable).toHaveBeenCalledWith({
        full_name: 'John Doe',
        role: 'Engineer',
        bio: 'Hello world',
      });
    });

    it('returns 400 if zod validation fails', async () => {
      const invalidPayload = {
        fullName: 'Jo',
        role: 'Dev',
      };

      const res = await app.request('/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      expect(res.status).toBe(400);
    });
  });
});
