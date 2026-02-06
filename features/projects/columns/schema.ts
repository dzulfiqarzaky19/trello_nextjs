import { z } from 'zod';

export const createColumnSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  headerColor: z.string().optional(),
  projectId: z.string(),
});

export const updateColumnSchema = z.object({
  title: z.string().optional(),
  position: z.number().optional(),
});
