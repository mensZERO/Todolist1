-- ========================================
-- SETUP LENGKAP SUPABASE UNTUK TODO APP
-- Jalankan SQL ini di Supabase SQL Editor
-- ========================================

-- 1. Buat tabel jika belum ada
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tambah kolom baru jika belum ada
ALTER TABLE todos ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE todos ADD COLUMN IF NOT EXISTS due_date DATE;

-- 3. Buat indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);

-- 4. Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 5. Hapus policy lama jika ada
DROP POLICY IF EXISTS "Enable read access for all users" ON todos;
DROP POLICY IF EXISTS "Enable insert access for all users" ON todos;
DROP POLICY IF EXISTS "Enable update access for all users" ON todos;
DROP POLICY IF EXISTS "Enable delete access for all users" ON todos;

-- 6. Buat policies baru (akses publik untuk demo)
CREATE POLICY "Enable read access for all users" ON todos
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON todos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON todos
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON todos
  FOR DELETE USING (true);

-- 7. Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Trigger untuk auto-update
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SELESAI! Tabel todos siap digunakan
-- ========================================
