import { z } from 'zod';

export const teamMemberSchema = z.object({
  userId: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string().nullable(),
  email: z.string().nullable(),
  activeTasks: z.number(),
  projectsCount: z.number(),
});

export const teamStatsSchema = z.object({
  data: z.array(teamMemberSchema),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
