-- Buat tabel todos
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Buat index untuk performa query yang lebih baik
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);

-- Enable Row Level Security (RLS) - opsional, untuk keamanan
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy untuk akses publik (untuk demo)
-- Untuk production, sebaiknya gunakan authentication
CREATE POLICY "Enable read access for all users" ON todos
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON todos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON todos
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON todos
  FOR DELETE USING (true);

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto-update updated_at
CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
