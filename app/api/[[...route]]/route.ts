import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '@/features/auth/server/route';
import settings from '@/features/settings/server/route';

const app = new Hono().basePath('/api');

const routes = app.route('/auth', auth).route('/settings', settings);

export const GET = handle(routes);
export const POST = handle(routes);
export const PUT = handle(routes);

export type TAppRoutes = typeof routes;
