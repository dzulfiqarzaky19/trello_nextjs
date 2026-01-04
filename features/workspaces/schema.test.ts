import { describe, it, expect } from 'vitest';
import {
  createWorkspaceSchema,
  workspacesListSchema,
  updateWorkspaceSchema,
} from './schema';

describe('Workspace Schemas', () => {
  describe('createWorkspaceSchema', () => {
    it('should validate a correct workspace object', () => {
      const validData = {
        name: 'Engineering Team',
        slug: 'eng-team-123',
        image: 'https://example.com/logo.png',
      };
      const result = createWorkspaceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if name is too short', () => {
      const result = createWorkspaceSchema.safeParse({
        name: 'ab',
        slug: 'valid-slug',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Workspace name must be at least 3 characters'
        );
      }
    });

    it('should allow empty or optional image', () => {
      expect(
        createWorkspaceSchema.safeParse({ name: 'Test', slug: 'test' }).success
      ).toBe(true);
      expect(
        createWorkspaceSchema.safeParse({
          name: 'Test',
          slug: 'test',
          image: null,
        }).success
      ).toBe(true);
    });

    it('should fail if slug is invalid', () => {
      const result = createWorkspaceSchema.safeParse({
        name: 'Valid Name',
        slug: 'Invalid Slug!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateWorkspaceSchema', () => {
    it('should validate partial updates', () => {
      const result = updateWorkspaceSchema.safeParse({
        name: 'Updated Name',
      });
      expect(result.success).toBe(true);
    });

    it('should allow removing image with null', () => {
      const result = updateWorkspaceSchema.safeParse({
        image: null,
      });
      expect(result.success).toBe(true);
    });

    it('should fail if partial name is too short', () => {
      const result = updateWorkspaceSchema.safeParse({
        name: 'ab',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('workspacesListSchema', () => {
    it('should validate a valid list of workspaces with members', () => {
      const validList = [
        {
          id: 'uuid-1',
          name: 'Main Workspace',
          slug: 'main',
          image_url: null,
          user_id: 'user-1',
          invite_code: 'invite-code-1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: null,
          members: [{ user_id: 'user-1' }, { user_id: 'user-2' }],
        },
      ];
      const result = workspacesListSchema.safeParse(validList);
      expect(result.success).toBe(true);
    });

    it('should fail if members is not an array', () => {
      const invalidData = [
        {
          id: 'uuid-1',
          name: 'Test',
          slug: 'test',
          image_url: null,
          user_id: 'u1',
          created_at: null,
          updated_at: null,
          members: { user_id: 'u1' }, // Error: Should be array
        },
      ];
      const result = workspacesListSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
