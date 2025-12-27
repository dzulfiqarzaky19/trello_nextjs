import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Workspace name must be at least 3 characters')
    .max(50, 'Workspace name must be less than 50 characters'),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug must be at least 3 characters')
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain letters, numbers, and hyphens'
    ),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
});

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  image_url: z.string().nullable(),
  user_id: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  members: z.array(
    z.object({
      user_id: z.string(),
    })
  ),
});

export const workspacesListSchema = z.array(workspaceSchema);

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export type ICreateWorkspace = z.infer<typeof createWorkspaceSchema>;
export type IUpdateWorkspace = z.infer<typeof updateWorkspaceSchema>;
export type IGetWorkspace = z.infer<typeof workspacesListSchema>;
