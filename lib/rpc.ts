import { hc } from 'hono/client';
import { TAppRoutes } from '@/app/api/[[...route]]/route';

const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const client = hc<TAppRoutes>(url);
