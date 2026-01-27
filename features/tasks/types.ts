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
  comments?: unknown[];
  attachments?: unknown[];
  due_date?: string | null;
  assigned_to: string | null;
  priority?: 'low' | 'medium' | 'high' | null;
}

export type Card = Task;
