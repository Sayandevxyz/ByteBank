'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, User, Terminal, ChevronDown } from 'lucide-react';

export default function MarketingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [user, setUser] = useState<{ role: string; fullName?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#060911]/90 backdrop-blur-md border-b border-white/[0.08] shadow-2xl'
          : 'bg-[#060911]/70 backdrop-blur-sm border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 p-1 flex items-center justify-center shrink-0 shadow-glow-blue transition-transform group-hover:scale-105">
            <Image
              src="/bytebank-icon.svg"
              alt="ByteBank"
              width={28}
              height={28}
              className="w-6 h-6 object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            Byte<span className="text-blue-500">Bank</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors py-2"
            >
              <span>DBMS Tools</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {toolsOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 rounded-2xl bg-[#0c1220] border border-white/10 p-2 shadow-2xl z-50">
                <Link
                  href="/admin/lab"
                  className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-blue-600/20 transition-colors"
                >
                  <div className="font-semibold text-white">Concurrency Lab</div>
                  <div className="text-[11px] text-slate-400">Test parallel row-level locks</div>
                </Link>
                <Link
                  href="/auditor/reconciliation"
                  className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-blue-600/20 transition-colors"
                >
                  <div className="font-semibold text-white">Reconciliation Worker</div>
                  <div className="text-[11px] text-slate-400">Audit ledger against holdings</div>
                </Link>
                <Link
                  href="/api/download/openapi"
                  target="_blank"
                  className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-blue-600/20 transition-colors"
                >
                  <div className="font-semibold text-white">OpenAPI 3.1 Spec</div>
                  <div className="text-[11px] text-slate-400">Interactive REST API docs</div>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/download"
            className={`transition-colors ${
              pathname === '/download'
                ? 'text-blue-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Download
          </Link>

          <Link
            href="/about"
            className={`transition-colors ${
              pathname === '/about'
                ? 'text-blue-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Architecture
          </Link>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-400">
            <span className="text-slate-500">Mode:</span>
            <span className="text-blue-400 font-semibold">PostgreSQL 16</span>
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              href={
                user.role === 'ADMIN'
                  ? '/admin/dashboard'
                  : user.role === 'AUDITOR'
                  ? '/auditor/dashboard'
                  : '/customer/dashboard'
              }
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0d1424] border border-blue-500/30 text-white text-xs font-semibold hover:border-blue-500/60 transition-all shadow-glow-blue"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>{user.fullName || user.role}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-glow-blue"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Console</span>
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#070b14] px-4 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/download"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            Download Data Pack
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            Architecture
          </Link>
          <Link
            href="/admin/lab"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            Concurrency Lab
          </Link>
          <div className="pt-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm shadow-glow-blue"
            >
              Launch Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
