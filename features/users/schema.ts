import { z } from 'zod';

export const userSearchResultSchema = z.object({
    id: z.string(),
    email: z.string(),
    full_name: z.string().nullable(),
    avatar_url: z.string().nullable(),
});

export const userSearchResponseSchema = z.object({
    data: z.array(userSearchResultSchema),
});

export type IUserSearchResult = z.infer<typeof userSearchResultSchema>;
export type IUserSearchResponse = z.infer<typeof userSearchResponseSchema>;
