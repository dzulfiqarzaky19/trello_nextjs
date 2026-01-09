import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';

const createChain = (finalResult: any = { data: null, error: null }) => {
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve(finalResult)),
    then: (resolve: any) => Promise.resolve(finalResult).then(resolve),
  };
  return chain;
};

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: vi.fn(),
}));

import { createSupabaseServer } from '@/lib/supabase/server';

vi.mock('@/lib/session-middleware', () => ({
  sessionMiddleware: async (c: any, next: any) => {
    c.set('user', { id: 'test-user-id', email: 'test@example.com' });
    await next();
  },
}));

describe('Workspace Detail Hono Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupSupabaseMock = (result: any) => {
    (createSupabaseServer as any).mockImplementation(async () => ({
      from: vi.fn(() => createChain(result)),
    }));
  };

  const mockWorkspaceDetail = {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-workspace',
    description: 'A test workspace',
    image_url: null,
    user_id: 'test-user-id',
    invite_code: '123456',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: null,
    user: {
      id: 'test-user-id',
      full_name: 'Test Creator',
      avatar_url: null,
      email: 'creator@example.com',
      role: 'ADMIN',
    },
    members: [
      {
        user_id: 'test-user-id',
        role: 'ADMIN',
        profiles: {
          id: 'test-user-id',
          full_name: 'Test Creator',
          avatar_url: null,
          email: 'creator@example.com',
        },
      },
    ],
    projects: [
      {
        id: 'prj-1',
        name: 'Project 1',
        image_url: null,
        workspace_id: 'ws-1',
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ],
  };

  it('returns workspace detail for valid ID', async () => {
    setupSupabaseMock({ data: mockWorkspaceDetail, error: null });

    const res = await app.request('/ws-1');
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.name).toBe('Test Workspace');
  });

  it('returns 404 if workspace not found', async () => {
    setupSupabaseMock({ data: null, error: null });

    const res = await app.request('/ws-1');
    expect(res.status).toBe(404);
  });

  it('returns 401 if user is not a member', async () => {
    const notMemberWorkspace = {
      ...mockWorkspaceDetail,
      members: [{ user_id: 'other-user', role: 'MEMBER' }],
    };
    setupSupabaseMock({ data: notMemberWorkspace, error: null });

    const res = await app.request('/ws-1');
    expect(res.status).toBe(401);
  });
});
