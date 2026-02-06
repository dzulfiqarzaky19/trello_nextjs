import { Task } from '@/features/projects/tasks/types';

export interface Column {
  id: string;
  name: string;
  project_id: string;
  position: number;
  created_at: string | null;
  updated_at: string | null;
  tasks: Task[];
}
