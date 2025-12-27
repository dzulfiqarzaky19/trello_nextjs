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
