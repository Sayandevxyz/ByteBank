'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Database, ShieldCheck, Terminal, Layers } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer className="w-full bg-[#05070d] text-slate-400 text-xs border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 p-1 flex items-center justify-center shrink-0 shadow-glow-blue">
                <Image
                  src="/bytebank-icon.svg"
                  alt="ByteBank Logo"
                  width={28}
                  height={28}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Byte<span className="text-blue-500">Bank</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Production-grade digital asset &amp; transaction management platform built on PostgreSQL 16.
              Features strict double-entry ledger rules, ACID serialization, and privacy-masked auditor views.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>PostgreSQL 16 &bull; 15/15 Invariants PASS</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="font-bold text-white uppercase tracking-wider text-xs font-sans">
              DBMS Tools
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/lab" className="hover:text-blue-400 transition-colors">
                  Concurrency Race Lab
                </Link>
              </li>
              <li>
                <Link href="/auditor/reconciliation" className="hover:text-blue-400 transition-colors">
                  Reconciliation Worker
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-blue-400 transition-colors">
                  PostgreSQL 16 DDL Schema
                </Link>
              </li>
              <li>
                <Link href="/api/download/openapi" target="_blank" className="hover:text-blue-400 transition-colors">
                  OpenAPI 3.1 Spec
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="font-bold text-white uppercase tracking-wider text-xs font-sans">
              Portals
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/customer/dashboard" className="hover:text-blue-400 transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-blue-400 transition-colors">
                  Admin KYC &amp; Limits
                </Link>
              </li>
              <li>
                <Link href="/auditor/dashboard" className="hover:text-blue-400 transition-colors">
                  Auditor Privacy View
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Role Login Console
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="font-bold text-white uppercase tracking-wider text-xs font-sans">
              Architecture
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  3NF / BCNF Schema
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  Double-Entry Invariants
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  Row-Level Locking
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  Access Log Masking
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} ByteBank. All balances and assets are simulated for educational database architecture.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Strict Relational Integrity</span>
            <span>&bull;</span>
            <span className="text-slate-400">Zero Unjournaled Drift</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
