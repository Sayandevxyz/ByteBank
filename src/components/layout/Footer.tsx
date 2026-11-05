'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MarketingFooter from './MarketingFooter';
import { Terminal, ShieldCheck, Scale, Database } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/about' || pathname === '/download') {
    return <MarketingFooter />;
  }

  return (
    <footer className="w-full border-t border-[#182030] bg-[#06080e] text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/bytebank-icon.svg"
                alt="ByteBank Logo"
                width={36}
                height={36}
                className="w-9 h-9 rounded-xl"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-lg tracking-tight leading-tight">
                  Byte<span className="text-blue-400">Bank</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
                  Digital Asset Ledger
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Production-grade digital asset &amp; transaction management platform built for relational database integrity, ACID guarantees, and audit compliance.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PostgreSQL 16 &bull; 15/15 Invariants PASS</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="font-bold text-white uppercase tracking-wider text-xs font-sans">
              Tools
            </div>
            <ul className="space-y-2">
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
                <Link href="/admin/lab" className="hover:text-blue-400 transition-colors">
                  Concurrency Lab
                </Link>
              </li>
              <li>
                <Link href="/admin/reconciliation" className="hover:text-blue-400 transition-colors">
                  Reconciliation Run
                </Link>
              </li>
              <li>
                <Link href="/customer/reservations" className="hover:text-blue-400 transition-colors">
                  Asset Reservations
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="font-bold text-white uppercase tracking-wider text-xs font-sans">
              Ledger Engine
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/customer/history" className="hover:text-blue-400 transition-colors">
                  Double-Entry Ledger
                </Link>
              </li>
              <li>
                <Link href="/auditor/transactions" className="hover:text-blue-400 transition-colors">
                  Masked Auditor Views
                </Link>
              </li>
              <li>
                <Link href="/auditor/audit-logs" className="hover:text-blue-400 transition-colors">
                  Immutable Audit Log
                </Link>
              </li>
              <li>
                <Link href="/auditor/access-logs" className="hover:text-blue-400 transition-colors">
                  Purpose Access Logs
                </Link>
              </li>
              <li>
                <Link href="/auditor/reports" className="hover:text-blue-400 transition-colors">
                  Compliance Reports
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
                <Link href="/docs" className="hover:text-blue-400 transition-colors">
                  OpenAPI 3.1 Spec
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-blue-400 transition-colors">
                  Download Data Packs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About ByteBank
                </Link>
              </li>
              <li>
                <Link href="/admin/kyc" className="hover:text-blue-400 transition-colors">
                  KYC Verification
                </Link>
              </li>
              <li>
                <Link href="/admin/accounts" className="hover:text-blue-400 transition-colors">
                  Account Management
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#182030] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>&copy; 2026 ByteBank DBMS Platform. All rights reserved.</div>

          <div className="text-center sm:text-right max-w-lg text-[10px] text-amber-500/70">
            SIMULATION NOTICE: All digital asset balances, token transfers, KYC hashes, and market reference prices are simulated representation units (SRU) within an isolated relational database environment. No real funds or fiat currency are handled.
          </div>
        </div>
      </div>
    </footer>
  );
}
