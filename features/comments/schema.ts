import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  taskId: z.string(),
  parentId: z.string().optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});
