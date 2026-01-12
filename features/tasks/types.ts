export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  column_id: string;
  position: number;
  created_at: string | null;
  updated_at: string | null;
  // Relations not in core schema but used in UI (mocked/optional for now)
  card_members?: any[];
  card_labels?: any[];
  checklists?: any[];
  comments?: any[];
  attachments?: any[];
  due_date?: string | null;
  priority?: 'low' | 'medium' | 'high' | null;
}

export type Card = Task; // Alias for backward compatibility
