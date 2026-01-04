import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '@/features/auth/server/route';
import settings from '@/features/settings/server/route';
import workspaceDetail from '@/features/workspaceDetail/server/route';
import workspaces from '@/features/workspaces/server/route';
import projects from '@/features/projects/server/route';

const app = new Hono().basePath('/api');

const routes = app
  .route('/auth', auth)
  .route('/settings', settings)
  .route('/workspaces', workspaces)
  .route('/workspaces', workspaceDetail) // workspaceDetail route is /:workspaceId, so we mount it under /workspaces to resolve as /api/workspaces/:workspaceId
  .route('/projects', projects);

export const GET = handle(routes);
export const POST = handle(routes);
export const PUT = handle(routes);
export const DELETE = handle(routes);
export const PATCH = handle(routes);

export type TAppRoutes = typeof routes;
