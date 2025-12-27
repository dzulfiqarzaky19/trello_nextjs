import { describe, it, expect } from 'vitest';
import { profileSchema, securitySchema } from './schema';

describe('settingsSchema', () => {
  describe('securitySchema', () => {
    it('should pass with two different valid passwords', () => {
      const validData = {
        currentPassword: 'old-password-123',
        newPassword: 'new-password-456',
      };
      const result = securitySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if passwords are the same (superRefine check)', () => {
      const identicalData = {
        currentPassword: 'password123',
        newPassword: 'password123',
      };
      const result = securitySchema.safeParse(identicalData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('newPassword');
        expect(result.error.issues[0].message).toBe(
          'The passwords are the same'
        );
      }
    });

    it('should fail if passwords are shorter than 6 characters', () => {
      const tooShort = {
        currentPassword: '123',
        newPassword: '45678',
      };
      const result = securitySchema.safeParse(tooShort);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
      }
    });

    it('should trim whitespace', () => {
      const data = {
        currentPassword: '  password123  ',
        newPassword: '  newpassword123  ',
      };
      const result = securitySchema.parse(data);
      expect(result.currentPassword).toBe('password123');
      expect(result.newPassword).toBe('newpassword123');
    });
  });

  describe('profileSchema', () => {
    it('should validate valid data correctly', () => {
      const validData = {
        fullName: 'John Doe',
        role: 'Fullstack Developer',
        bio: 'Working on a Trello clone.',
      };
      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if fullName is less than 3 characters', () => {
      const invalidData = {
        fullName: 'Jo',
        role: 'Dev',
      };
      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Full name must be at least 3 characters'
        );
      }
    });

    it('should trim whitespace from inputs', () => {
      const data = {
        fullName: '  John Doe  ',
        role: '  Developer  ',
      };
      const result = profileSchema.parse(data);
      expect(result.fullName).toBe('John Doe');
      expect(result.role).toBe('Developer');
    });
  });
});
