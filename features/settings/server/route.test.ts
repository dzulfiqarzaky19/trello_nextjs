import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';
import { SettingsService } from './services';

vi.mock('./services', () => ({
  SettingsService: {
    changePassword: vi.fn(),
    updateProfile: vi.fn(),
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

describe('Settings Hono Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /security', () => {
    it('returns 200 when password change succeeds', async () => {
      vi.mocked(SettingsService.changePassword).mockResolvedValue({
        ok: true,
        data: { message: 'Password updated successfully' },
      });

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
      expect(SettingsService.changePassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        currentPassword: 'old-password',
        newPassword: 'new-password-secure',
      });
    });

    it('returns 401 if the current password is incorrect', async () => {
      vi.mocked(SettingsService.changePassword).mockResolvedValue({
        ok: false,
        error: 'Incorrect current password',
        status: 401,
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
    });

    it('returns 400 when passwords are the same (zod validation)', async () => {
      const res = await app.request('/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: 'same-password',
          newPassword: 'same-password',
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /profile', () => {
    it('updates the profile and returns 200', async () => {
      vi.mocked(SettingsService.updateProfile).mockResolvedValue({
        ok: true,
        data: { message: 'Profile updated successfully' },
      });

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
      expect(SettingsService.updateProfile).toHaveBeenCalledWith({
        userId: 'test-user-id',
        fullName: 'John Doe',
        role: 'Engineer',
        bio: 'Hello world',
      });
    });

    it('returns 401 when service fails', async () => {
      vi.mocked(SettingsService.updateProfile).mockResolvedValue({
        ok: false,
        error: 'Database error',
        status: 401,
      });

      const res = await app.request('/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'John Doe',
          role: 'Engineer',
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(401);
      expect(body.error).toBe('Database error');
    });

    it('returns 400 if zod validation fails', async () => {
      const invalidPayload = {
        fullName: 'Jo',
        role: 'De',
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

