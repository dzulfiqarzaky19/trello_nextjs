import { z } from 'zod';

export const memberRoleSchema = z.enum(['ADMIN', 'MEMBER']);

export const addMemberSchema = z.object({
  workspaceId: z.string(),
  userId: z.string().uuid(),
  role: memberRoleSchema.default('MEMBER'),
});

export const updateMemberRoleSchema = z.object({
  workspaceId: z.string(),
  role: memberRoleSchema,
});

export const removeMemberSchema = z.object({
  workspaceId: z.string(),
});

export const membersListSchema = z.object({
  members: z.array(
    z.object({
      user_id: z.string(),
      role: memberRoleSchema,
      profiles: z.object({
        id: z.string(),
        full_name: z.string().nullable(),
        avatar_url: z.string().nullable(),
        email: z.string(),
      }),
    })
  ),
  isAdmin: z.boolean(),
  currentUserId: z.string(),
  workspaceId: z.string(),
});
