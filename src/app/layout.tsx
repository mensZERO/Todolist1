import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advanced Todo App",
  description: "Modern todo list with Next.js, TypeScript, and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
