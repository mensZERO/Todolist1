'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Todo, FilterType, SortType, Priority, Category } from '@/types/todo';
import { fetchTodos, insertTodo, updateTodo, deleteTodo, toggleTodo } from '@/lib/supabase';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import FilterBar from '@/components/FilterBar';
import TodoSkeleton from '@/components/TodoSkeleton';
import ExportImport from '@/components/ExportImport';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
      alert('Gagal memuat data. Pastikan Supabase sudah dikonfigurasi dengan benar.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (title: string, priority: Priority, category: Category, dueDate: string | null) => {
    try {
      const newTodo = await insertTodo(title, priority, category, dueDate);
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Gagal menambahkan tugas.');
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await toggleTodo(id, completed);
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Gagal mengubah status tugas.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Yakin ingin menghapus tugas ini?')) return;
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Gagal menghapus tugas.');
    }
  };

  const handleUpdateTodo = async (id: string, title: string, priority: Priority, category: Category, dueDate: string | null) => {
    try {
      await updateTodo(id, { title, priority, category, due_date: dueDate });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, title, priority, category, due_date: dueDate } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Gagal mengupdate tugas.');
    }
  };

  const handleImport = async (importedTodos: Todo[]) => {
    try {
      for (const todo of importedTodos) {
        await insertTodo(todo.title, todo.priority, todo.category, todo.due_date);
      }
      await loadTodos();
    } catch (error) {
      console.error('Error importing todos:', error);
      alert('Gagal import beberapa tugas.');
    }
  };

  const filteredAndSortedTodos = todos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const isOverdue = todo.due_date && !todo.completed && new Date(todo.due_date) < new Date();
      const matchesFilter = 
        filterType === 'all' ? true :
        filterType === 'active' ? !todo.completed :
        filterType === 'completed' ? todo.completed :
        filterType === 'overdue' ? isOverdue : true;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortType === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortType === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortType === 'dueDate') {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
    overdue: todos.filter(t => t.due_date && !t.completed && new Date(t.due_date) < new Date()).length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle2 size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Advanced Todo App
            </h1>
            <DarkModeToggle />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola tugas Anda dengan mudah dan efisien
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Aktif</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Selesai</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Terlambat</div>
            </div>
          </div>

          {stats.total > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm font-bold text-blue-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tugas Saya</h2>
            <ExportImport todos={todos} onImport={handleImport} />
          </div>

          <TodoInput onAdd={handleAddTodo} isLoading={loading} />
          
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterChange={setFilterType}
            sortType={sortType}
            onSortChange={setSortType}
          />

          {loading ? (
            <TodoSkeleton />
          ) : filteredAndSortedTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || filterType !== 'all' 
                  ? 'Tidak ada tugas yang cocok dengan filter'
                  : 'Belum ada tugas. Tambahkan tugas pertama Anda!'}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {filteredAndSortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600 dark:text-gray-400 text-sm"
        >
          Built with Next.js, TypeScript, Tailwind CSS & Supabase
        </motion.footer>
      </div>
    </div>
  );
}
