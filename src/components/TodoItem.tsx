'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Check, X, Calendar, AlertCircle } from 'lucide-react';
import { Todo, Priority, Category } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, priority: Priority, category: Category, dueDate: string | null) => void;
}

const priorityColors = {
  low: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
  medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
  high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
};

const categoryIcons = {
  general: '📋',
  work: '💼',
  personal: '👤',
  shopping: '🛒',
  health: '❤️',
};

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.due_date || '');

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle.trim(), editPriority, editCategory, editDueDate || null);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.due_date || '');
    setIsEditing(false);
  };

  const isOverdue = todo.due_date && !todo.completed && new Date(todo.due_date) < new Date();
  const daysUntilDue = todo.due_date ? Math.ceil((new Date(todo.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border ${
        isOverdue ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Category)}
                  className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                </select>
              </div>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <>
              <p className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {todo.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[todo.priority]}`}>
                  {todo.priority.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {categoryIcons[todo.category]} {todo.category}
                </span>
                {todo.due_date && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    isOverdue 
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
                      : daysUntilDue !== null && daysUntilDue <= 3
                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                    {isOverdue && <AlertCircle size={12} />}
                    <Calendar size={12} />
                    {new Date(todo.due_date).toLocaleDateString('id-ID')}
                    {daysUntilDue !== null && !todo.completed && (
                      <span className="ml-1">
                        ({daysUntilDue === 0 ? 'Hari ini' : daysUntilDue > 0 ? `${daysUntilDue} hari` : `Terlambat ${Math.abs(daysUntilDue)} hari`})
                      </span>
                    )}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(todo.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                title="Simpan"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Batal"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
