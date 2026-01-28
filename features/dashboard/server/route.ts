import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DashboardService } from './services';

const app = new Hono()
  .get('/stats', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const result = await DashboardService.getStats(user.id);
    return c.json(result);
  })
  .get('/task-distribution', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const result = await DashboardService.getTaskDistribution(user.id);
    return c.json(result);
  })
  .get('/team-workload', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const result = await DashboardService.getTeamWorkload(user.id);
    return c.json(result);
  })
  .get('/recent-activity', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const result = await DashboardService.getRecentActivity(user.id);
    return c.json(result);
  });

export default app;
