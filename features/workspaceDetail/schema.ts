import { z } from 'zod';
import { workspaceSchema } from '@/features/workspaces/schema';

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  image_url: z.string().nullable(),
  workspace_id: z.string(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']),
  created_at: z.string(),
  updated_at: z.string(),
});

export const workspaceDetailSchema = workspaceSchema.extend({
  projects: z.array(projectSchema),
});

export type IProject = z.infer<typeof projectSchema>;
export type IWorkspaceDetail = z.infer<typeof workspaceDetailSchema>;
