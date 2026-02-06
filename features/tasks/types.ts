import { Tables } from '@/lib/supabase/database.types';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  column_id: string;
  position: number;
  created_at: string | null;
  updated_at: string | null;
  // The following are placeholders for future tables (card_members, card_labels, etc.)
  // that are not yet defined in the database schema. Using unknown[] until tables are created.
  card_members?: unknown[];
  card_labels?: unknown[];
  checklists?: unknown[];
  comments?: { count: number }[];
  attachments?: unknown[];
  due_date?: string | null;
  deadlines: string;
  assigned_to: string | null;
  assigned_to_user?: Tables<'profiles'> | null;
  priority?: 'low' | 'medium' | 'high' | null;
}

export type Card = Task;
