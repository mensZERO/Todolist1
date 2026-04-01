-- Enable Row Level Security (jika belum)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada (ignore error jika tidak ada)
DROP POLICY IF EXISTS "Enable read access for all users" ON todos;
DROP POLICY IF EXISTS "Enable insert access for all users" ON todos;
DROP POLICY IF EXISTS "Enable update access for all users" ON todos;
DROP POLICY IF EXISTS "Enable delete access for all users" ON todos;

-- Buat policy baru
CREATE POLICY "Enable read access for all users" ON todos
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON todos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON todos
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON todos
  FOR DELETE USING (true);
