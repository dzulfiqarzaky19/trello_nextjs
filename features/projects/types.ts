export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

export interface Member {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'ADMIN' | 'MEMBER';
  profiles: Profile;
}

import { Task } from '@/features/projects/tasks/types';

export type { Task };
export type { Card } from '@/features/projects/tasks/types';

import { Column } from '@/features/projects/columns/types';

export type { Column };

export interface Project {
  id: string;
  name: string;
  image_url: string | null;
  workspace_id: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | null;
  created_at: string | null;
  updated_at: string | null;
  columns?: Column[];
}
