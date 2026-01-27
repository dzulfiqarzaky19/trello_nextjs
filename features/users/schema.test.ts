import { describe, it, expect } from 'vitest';
import {
    userSearchResultSchema,
    userSearchResponseSchema,
} from './schema';

describe('User Schemas', () => {
    describe('userSearchResultSchema', () => {
        it('validates a complete user result', () => {
            const validUser = {
                id: 'user-123',
                email: 'test@example.com',
                full_name: 'Test User',
                avatar_url: 'http://example.com/avatar.png',
            };

            const result = userSearchResultSchema.safeParse(validUser);
            expect(result.success).toBe(true);
        });

        it('allows null for optional fields', () => {
            const userWithNulls = {
                id: 'user-123',
                email: 'test@example.com',
                full_name: null,
                avatar_url: null,
            };

            const result = userSearchResultSchema.safeParse(userWithNulls);
            expect(result.success).toBe(true);
        });

        it('fails when required fields are missing', () => {
            const invalidUser = {
                id: 'user-123',
                // missing email
                full_name: 'Test User',
                avatar_url: null,
            };

            const result = userSearchResultSchema.safeParse(invalidUser);
            expect(result.success).toBe(false);
        });

        it('fails when id is missing', () => {
            const invalidUser = {
                email: 'test@example.com',
                full_name: 'Test User',
                avatar_url: null,
            };

            const result = userSearchResultSchema.safeParse(invalidUser);
            expect(result.success).toBe(false);
        });
    });

    describe('userSearchResponseSchema', () => {
        it('validates a response with users', () => {
            const response = {
                data: [
                    {
                        id: 'user-1',
                        email: 'user1@example.com',
                        full_name: 'User One',
                        avatar_url: 'http://example.com/1.png',
                    },
                    {
                        id: 'user-2',
                        email: 'user2@example.com',
                        full_name: null,
                        avatar_url: null,
                    },
                ],
            };

            const result = userSearchResponseSchema.safeParse(response);
            expect(result.success).toBe(true);
        });

        it('validates an empty response', () => {
            const response = { data: [] };

            const result = userSearchResponseSchema.safeParse(response);
            expect(result.success).toBe(true);
        });

        it('fails when data is not an array', () => {
            const invalidResponse = { data: 'not an array' };

            const result = userSearchResponseSchema.safeParse(invalidResponse);
            expect(result.success).toBe(false);
        });

        it('fails when data is missing', () => {
            const invalidResponse = {};

            const result = userSearchResponseSchema.safeParse(invalidResponse);
            expect(result.success).toBe(false);
        });
    });
});
