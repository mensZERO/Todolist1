'use client';

import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { FilterType, SortType } from '@/types/todo';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  sortType,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari tugas..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'completed', 'overdue'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter === 'all' ? 'Semua' : 
                 filter === 'active' ? 'Aktif' : 
                 filter === 'completed' ? 'Selesai' : 'Terlambat'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={18} className="text-gray-500" />
          <select
            value={sortType}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="date">Terbaru</option>
            <option value="priority">Prioritas</option>
            <option value="dueDate">Deadline</option>
          </select>
        </div>
      </div>
    </div>
  );
}
