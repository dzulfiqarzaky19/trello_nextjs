import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().optional(),
  columnId: z.string(),
  projectId: z.string(),
  position: z.number().default(0),
  assignedTo: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  deadlines: z.string().optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  columnId: z.string().optional(),
  position: z.number().optional(),
  assignedTo: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  deadlines: z.string().optional().nullable(),
});
