import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createCommentSchema, updateCommentSchema } from '../schema';
import { CommentService } from './services';

import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
    .get('/:taskId', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const taskId = c.req.param('taskId');

        const result = await CommentService.getComments(user.id, taskId);

        if (!result.ok) {
            return c.json({ error: result.error }, result.status);
        }

        return c.json({ data: result.data });
    })
    .post(
        '/',
        sessionMiddleware,
        zValidator('json', createCommentSchema),
        async (c) => {
            const user = c.get('user');
            const json = c.req.valid('json');

            const result = await CommentService.createComment(user.id, json);

            if (!result.ok) {
                return c.json({ error: result.error }, result.status);
            }

            return c.json({ data: result.data });
        }
    )
    .patch(
        '/:commentId',
        sessionMiddleware,
        zValidator('json', updateCommentSchema),
        async (c) => {
            const user = c.get('user');
            const commentId = c.req.param('commentId');
            const json = c.req.valid('json');

            const result = await CommentService.updateComment(user.id, commentId, json);

            if (!result.ok) {
                return c.json({ error: result.error }, result.status);
            }

            return c.json({ data: result.data });
        }
    )
    .delete('/:commentId', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const commentId = c.req.param('commentId');

        const result = await CommentService.deleteComment(user.id, commentId);

        if (!result.ok) {
            return c.json({ error: result.error }, result.status);
        }

        return c.json({ success: true });
    });

export default app;
