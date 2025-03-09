export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  due_date?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  due_date?: string;
  tags: string[];
} 