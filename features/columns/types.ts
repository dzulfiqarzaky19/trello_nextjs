import { Task } from '@/features/tasks/types';

export interface Column {
  id: string;
  name: string;
  project_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  tasks: Task[];
}
