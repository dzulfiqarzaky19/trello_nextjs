import { describe, it, expect } from 'vitest';
import { signInSchema, signUpSchema } from './schema';

describe('Auth Schemas', () => {
  describe('signInSchema', () => {
    it('should validate a correct email and password', () => {
      const result = signInSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email format', () => {
      const result = signInSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });
  });

  describe('signUpSchema', () => {
    it('should pass when all fields are valid and passwords match', () => {
      const validData = {
        email: 'new@example.com',
        fullName: 'John Doe',
        password: 'securepassword',
        confirmPassword: 'securepassword',
      };
      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if passwords do not match (superRefine)', () => {
      const mismatchedData = {
        email: 'new@example.com',
        fullName: 'John Doe',
        password: 'password123',
        confirmPassword: 'differentpassword',
      };
      const result = signUpSchema.safeParse(mismatchedData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmIssue = result.error.issues.find((i) =>
          i.path.includes('confirmPassword')
        );
        expect(confirmIssue?.message).toBe('The passwords did not match');
      }
    });

    it('should enforce minimum length for fullName', () => {
      const result = signUpSchema.safeParse({
        email: 'a@b.com',
        fullName: 'Jo',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });
});
