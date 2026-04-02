'use client';

import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import { Todo } from '@/types/todo';

interface ExportImportProps {
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
}

export default function ExportImport({ todos, onImport }: ExportImportProps) {
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

  const handleExportExcel = () => {
    // Header CSV
    const headers = ['Judul', 'Status', 'Prioritas', 'Kategori', 'Deadline', 'Dibuat', 'Diupdate'];
    
    // Convert todos ke rows
    const rows = todos.map(todo => [
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
    link.download = `todos-${new Date().toISOString().split('T')[0]}.csv`;
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
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={handleExportExcel}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
        title="Export ke Excel (CSV)"
      >
        <FileSpreadsheet size={16} />
        <span className="hidden sm:inline">Excel</span>
      </button>

      <button
        onClick={handleExportJSON}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        title="Export data ke file JSON"
      >
        <Download size={16} />
        <span className="hidden sm:inline">JSON</span>
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
