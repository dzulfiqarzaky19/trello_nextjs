import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Invalid email address').trim(),
  password: z.string().trim().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z
  .object({
    email: z.email('Invalid email address').trim(),
    password: z
      .string()
      .trim()
      .min(6, 'Password must be at least 6 characters'),
    fullName: z
      .string()
      .trim()
      .min(3, 'Full name must be at least 3 characters'),
    confirmPassword: z
      .string()
      .trim()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });
