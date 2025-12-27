import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';

const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockGetSession = vi.fn();
const mockGetUser = vi.fn();
const mockSignOut = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: vi.fn(async () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
      getSession: mockGetSession,
      getUser: mockGetUser,
      signOut: mockSignOut,
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: mockSingle,
    })),
  })),
}));

describe('Auth Hono Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /login', () => {
    it('returns user data on successful login', async () => {
      mockSignIn.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      const res = await app.request('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'password123',
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.response.user.id).toBe('123');
    });

    it('returns error message when Supabase login fails', async () => {
      mockSignIn.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      const res = await app.request('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'password123',
        }),
      });

      const body = await res.json();
      expect(body.error).toBe('Invalid credentials');
    });
  });

  describe('POST /register', () => {
    it('returns session on successful signup with auto-login', async () => {
      mockSignUp.mockResolvedValue({ error: null });
      mockGetSession.mockResolvedValue({
        data: { session: { access_token: 'abc' } },
      });

      const res = await app.request('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'new@test.com',
          password: 'password123',
          fullName: 'John Doe',
          confirmPassword: 'password123',
        }),
      });

      const body = await res.json();
      expect(body.response.access_token).toBe('abc');
    });
  });

  describe('GET /me', () => {
    it('returns user and profile when authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
      mockSingle.mockResolvedValue({
        data: { full_name: 'John Doe' },
        error: null,
      });

      const res = await app.request('/me');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.user.id).toBe('user-1');
      expect(body.profile.full_name).toBe('John Doe');
    });

    it('returns 200 with error field if user is not found', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const res = await app.request('/me');
      const body = await res.json();

      expect(body.error).toBe('User not found');
    });
  });
});
