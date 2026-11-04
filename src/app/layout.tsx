import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingAssistant from '@/components/chat/FloatingAssistant';

export const metadata: Metadata = {
  title: 'ByteBank | Digital Asset & Transaction Management System',
  description: 'Production-grade DBMS project featuring real PostgreSQL 16 ACID transactions, double-entry ledger bookkeeping, rule-based risk screening, and privacy-aware access logging.',
  icons: {
    icon: '/bytebank-icon.svg',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#06080e] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <FloatingAssistant />
      </body>
    </html>
  );
}
