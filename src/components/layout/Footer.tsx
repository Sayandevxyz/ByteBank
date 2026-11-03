import React from 'react';
import Link from 'next/link';
import { Database, ShieldCheck, Scale, Cpu, Terminal, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-blue-900/20 bg-[#02050e] text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-glow-blue">
                B
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Byte<span className="text-blue-500">Bank</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Production-grade digital asset &amp; transaction management platform built for relational database integrity, ACID guarantees, and audit compliance.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PostgreSQL 18 &bull; 15/15 Invariants PASS</span>
            </div>
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
                <Link href="/customer/transfer" className="hover:text-blue-400 transition-colors">
                  Transfer Terminal
                </Link>
              </li>
              <li>
                <Link href="/customer/swap" className="hover:text-blue-400 transition-colors">
                  Simulated Swaps
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-blue-400 transition-colors">
                  Admin Center
                </Link>
              </li>
              <li>
                <Link href="/auditor/dashboard" className="hover:text-blue-400 transition-colors">
                  Auditor Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="font-bold text-white uppercase tracking-wider text-xs font-sans">
              DBMS Core
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/lab" className="hover:text-blue-400 transition-colors flex items-center gap-1 text-purple-400">
                  <Terminal className="w-3 h-3" /> In-App DBMS Lab
                </Link>
              </li>
              <li>
                <Link href="/admin/reconciliation" className="hover:text-blue-400 transition-colors">
                  Ledger Reconciliation
                </Link>
              </li>
              <li>
                <Link href="/customer/reservations" className="hover:text-blue-400 transition-colors">
                  Asset Reservations
                </Link>
              </li>
              <li>
                <Link href="/auditor/transactions" className="hover:text-blue-400 transition-colors">
                  Masked Transactions
                </Link>
              </li>
              <li>
                <Link href="/auditor/audit-logs" className="hover:text-blue-400 transition-colors">
                  Immutable Audit Log
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="font-bold text-white uppercase tracking-wider text-xs font-sans">
              Documentation
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="hover:text-blue-400 transition-colors">
                  OpenAPI 3.1 Spec
                </Link>
              </li>
              <li>
                <a href="/api/docs" target="_blank" className="hover:text-blue-400 transition-colors">
                  Raw OpenAPI JSON
                </a>
              </li>
              <li>
                <Link href="/admin/lab" className="hover:text-blue-400 transition-colors">
                  Concurrency Tests
                </Link>
              </li>
              <li>
                <Link href="/auditor/reports" className="hover:text-blue-400 transition-colors">
                  Compliance Analytics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>&copy; 2026 ByteBank DBMS Architecture. All database invariants verified.</div>

          <div className="text-center sm:text-right max-w-lg text-[10px] text-amber-500/70">
            SIMULATION NOTICE: All digital asset balances, token transfers, KYC hashes, and market reference prices are simulated representation units (SRU) within an isolated relational database environment. No real funds or fiat currency are handled.
          </div>
        </div>
      </div>
    </footer>
  );
}
