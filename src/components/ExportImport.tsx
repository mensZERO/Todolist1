'use client';

import { Download, Upload } from 'lucide-react';
import { Todo } from '@/types/todo';

interface ExportImportProps {
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
}

export default function ExportImport({ todos, onImport }: ExportImportProps) {
  const handleExport = () => {
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
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
        title="Export data ke file JSON"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Export</span>
      </button>
      
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
