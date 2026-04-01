export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'general';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type FilterType = 'all' | 'active' | 'completed' | 'overdue';
export type SortType = 'date' | 'priority' | 'dueDate';
