import { createClient } from '@supabase/supabase-js';
import { Todo } from '@/types/todo';

// Gunakan environment variables dengan fallback untuk development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pueaeklmjyebplutvyvz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZWFla2xtanllYnBsdXR2eXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTA2ODUsImV4cCI6MjA5MDYyNjY4NX0.gq8gAtDS4dRfjsULo15TLvC4ZL6c-N3cg2aTFzC-0-8';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch all todos
export async function fetchTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Todo[];
}

// Insert new todo
export async function insertTodo(
  title: string, 
  priority: string = 'medium',
  category: string = 'general',
  due_date: string | null = null
) {
  const { data, error } = await supabase
    .from('todos')
    .insert([{ title, priority, category, due_date }])
    .select()
    .single();

  if (error) throw error;
  return data as Todo;
}

// Update todo
export async function updateTodo(id: string, updates: Partial<Todo>) {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Todo;
}

// Delete todo
export async function deleteTodo(id: string) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Toggle todo completion
export async function toggleTodo(id: string, completed: boolean) {
  return updateTodo(id, { completed });
}
