'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Priority, Category } from '@/types/todo';

interface TodoInputProps {
  onAdd: (title: string, priority: Priority, category: Category, dueDate: string | null) => void;
  isLoading?: boolean;
}

export default function TodoInput({ onAdd, isLoading }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('general');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), priority, category, dueDate || null);
      setTitle('');
      setPriority('medium');
      setCategory('general');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambahkan tugas baru..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={isLoading}
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          >
            <option value="general">📋 General</option>
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="shopping">🛒 Shopping</option>
            <option value="health">❤️ Health</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </form>
  );
}
