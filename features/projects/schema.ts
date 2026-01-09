import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(3, 'Minimum 3 characters required'),
  workspace_id: z.string(),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(3).optional(),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
});
