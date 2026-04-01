-- Migration untuk menambahkan fitur baru
-- Jalankan SQL ini di Supabase SQL Editor

-- Tambah kolom due_date dan category
ALTER TABLE todos ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE todos ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Update index untuk performa
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);

-- Contoh categories yang bisa digunakan: work, personal, shopping, health, general
