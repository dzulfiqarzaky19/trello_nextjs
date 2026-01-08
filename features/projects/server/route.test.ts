import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './route';

const createChain = (finalResult: any = { data: null, error: null }) => {
    const chain: any = {
        select: vi.fn(() => chain),
        eq: vi.fn(() => chain),
        in: vi.fn(() => chain),
        insert: vi.fn(() => chain),
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

describe('Projects Hono Route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const setupSupabaseMock = (result: any) => {
        (createSupabaseServer as any).mockImplementation(async () => ({
            from: vi.fn(() => createChain(result)),
            storage: {
                from: vi.fn(() => ({
                    upload: vi.fn(() => Promise.resolve({ data: { path: 'path' }, error: null })),
                    getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'url' } })),
                })),
            }
        }));
    };

    it('GET / returns projects filtered by workspaceId', async () => {
        const mockProjects = [{ id: 'p1', name: 'Project 1', workspace_id: 'ws-1' }];
        setupSupabaseMock({ data: mockProjects, error: null });

        const res = await app.request('/?workspaceId=ws-1');
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data).toEqual(mockProjects);
    });

    it('POST / creates a project', async () => {
        const mockProject = { id: 'p1', name: 'New Project', workspace_id: 'ws-1', status: 'ACTIVE' };

        (createSupabaseServer as any).mockImplementation(async () => ({
            from: vi.fn((table) => {
                if (table === 'members') return createChain({ data: { role: 'ADMIN' }, error: null });
                if (table === 'projects') return createChain({ data: mockProject, error: null });
                return createChain({});
            }),
            storage: {
                from: vi.fn(() => ({
                    upload: vi.fn(() => Promise.resolve({ data: { path: 'path' }, error: null })),
                    getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'url' } })),
                })),
            }
        }));

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
    });
});
