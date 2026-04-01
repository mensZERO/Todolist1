# Advanced To-Do List App

Aplikasi To-Do List tingkat lanjut dengan Next.js 14, TypeScript, Tailwind CSS, dan Supabase.

## Fitur

- ✅ CRUD lengkap (Create, Read, Update, Delete)
- 🏷️ Kategori prioritas (Low, Medium, High)
- 🔍 Filter & Search
- 📊 Sorting berdasarkan tanggal atau prioritas
- 💾 Persistence dengan Supabase
- 🎨 UI/UX modern dengan animasi
- 📱 Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup Supabase:
   - Buat project di [Supabase](https://supabase.com)
   - Jalankan SQL query dari `supabase-schema.sql`
   - Copy URL dan Anon Key dari project settings

3. Setup environment variables:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` dan isi dengan credentials Supabase Anda.

4. Run development server:
```bash
npm run dev
```

5. Buka [http://localhost:3000](http://localhost:3000)

## Deploy ke Vercel

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan environment variables di Vercel dashboard
4. Deploy!

## Struktur Database

Lihat `supabase-schema.sql` untuk struktur tabel lengkap.
