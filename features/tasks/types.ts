export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  column_id: string;
  position: number;
  created_at: string | null;
  updated_at: string | null;
  card_members?: any[];
  card_labels?: any[];
  checklists?: any[];
  comments?: any[];
  attachments?: any[];
  due_date?: string | null;
  assigned_to: string | null;
  priority?: 'low' | 'medium' | 'high' | null;
}

export type Card = Task;
