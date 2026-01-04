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

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  column_id: string;
  position: number;
  created_at: string;
  updated_at: string;
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

export interface Column {
  id: string;
  name: string;
  project_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  image_url: string | null;
  workspace_id: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
  columns: Column[];
}
