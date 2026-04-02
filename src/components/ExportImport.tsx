'use client';

import { useState } from 'react';
import { Download, Upload, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { Todo } from '@/types/todo';

interface ExportImportProps {
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
}

type ExportFilter = 'all' | 'completed' | 'active' | 'overdue';

export default function ExportImport({ todos, onImport }: ExportImportProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filterTodos = (filter: ExportFilter): Todo[] => {
    switch (filter) {
      case 'completed':
        return todos.filter(t => t.completed);
      case 'active':
        return todos.filter(t => !t.completed);
      case 'overdue':
        return todos.filter(t => t.due_date && !t.completed && new Date(t.due_date) < new Date());
      case 'all':
      default:
        return todos;
    }
  };

  const getFilterLabel = (filter: ExportFilter): string => {
    switch (filter) {
      case 'completed': return 'Selesai';
      case 'active': return 'Aktif';
      case 'overdue': return 'Terlambat';
      case 'all': return 'Semua';
    }
  };

  const handleExportExcel = (filter: ExportFilter) => {
    const filteredTodos = filterTodos(filter);
    
    if (filteredTodos.length === 0) {
      alert('Tidak ada tugas untuk di-export!');
      return;
    }

    // Header CSV
    const headers = ['Judul', 'Status', 'Prioritas', 'Kategori', 'Deadline', 'Dibuat', 'Diupdate'];
    
    // Convert todos ke rows
    const rows = filteredTodos.map(todo => [
      todo.title,
      todo.completed ? 'Selesai' : 'Aktif',
      todo.priority.toUpperCase(),
      todo.category,
      todo.due_date ? new Date(todo.due_date).toLocaleDateString('id-ID') : '-',
      new Date(todo.created_at).toLocaleDateString('id-ID'),
      new Date(todo.updated_at).toLocaleDateString('id-ID')
    ]);

    // Gabungkan header dan rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-${getFilterLabel(filter).toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTodos = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedTodos)) {
          onImport(importedTodos);
          alert(`Berhasil import ${importedTodos.length} tugas!`);
        } else {
          alert('Format file tidak valid!');
        }
      } catch (error) {
        alert('Gagal membaca file. Pastikan file adalah JSON yang valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex gap-2 flex-wrap relative">
      {/* Excel Export with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
          title="Export ke Excel (CSV)"
        >
          <FileSpreadsheet size={16} />
          <span className="hidden sm:inline">Excel</span>
          <ChevronDown size={14} />
        </button>

        {showExportMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowExportMenu(false)}
            />
            <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[180px] z-20">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Export Excel
              </div>
              {(['all', 'active', 'completed', 'overdue'] as ExportFilter[]).map((filter) => {
                const count = filterTodos(filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => handleExportExcel(filter)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {getFilterLabel(filter)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* JSON Export */}
      <button
        onClick={handleExportJSON}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        title="Export data ke file JSON"
      >
        <Download size={16} />
        <span className="hidden sm:inline">JSON</span>
      </button>
      
      {/* Import */}
      <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors cursor-pointer text-sm">
        <Upload size={16} />
        <span className="hidden sm:inline">Import</span>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
