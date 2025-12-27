import { z } from 'zod';

export const securitySchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(6, 'Confirm password must be at least 6 characters'),
    newPassword: z
      .string()
      .trim()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .superRefine(({ currentPassword, newPassword }, ctx) => {
    if (currentPassword === newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords are the same',
        path: ['newPassword'],
      });
    }
  });

export const profileSchema = z.object({
  avatarUrl: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  fullName: z.string().trim().min(3, 'Full name must be at least 3 characters'),
  role: z.string().trim().min(3, 'Role must be at least 3 characters'),
});
