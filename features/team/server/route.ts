import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { TeamService } from './services';

const app = new Hono().get('/', sessionMiddleware, async (c) => {
  const user = c.get('user');
  const stats = await TeamService.getTeamStats(user.id);
  return c.json({ data: stats });
});

export default app;
