import { supabase } from '@/lib/supabase';
import { CreateTaskInput, Task } from '@/types/task';

export const taskService = {
  async createTask(task: CreateTaskInput): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: task.completed,
        due_date: task.due_date,
        tags: task.tags
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating task:', error);
      return null;
    }

    return data as Task;
  },

  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return data as Task[];
  },

  async updateTask(id: string, updates: Partial<CreateTaskInput>): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating task:', error);
      return null;
    }

    return data as Task;
  },

  async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }

    return true;
  },

  async toggleTaskCompletion(id: string, completed: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id);

    if (error) {
      console.error('Error updating task completion:', error);
      return false;
    }

    return true;
  }
}; 