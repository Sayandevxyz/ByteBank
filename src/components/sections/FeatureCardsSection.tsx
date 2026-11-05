'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Search,
  History,
  RotateCcw,
  Clock,
  Shield,
  MessageSquare,
  Fingerprint,
  BarChart2,
  PieChart,
  DownloadCloud,
  Layers,
  Sliders,
  CheckCircle,
  Zap,
} from 'lucide-react';

const RobotMascotCanvas = dynamic(() => import('../canvas/RobotMascotCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-20 h-24 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-blue-600/30 animate-pulse" />
    </div>
  ),
});

export default function FeatureCardsSection() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#060911] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto space-y-20 relative">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/30 text-[11px] font-mono text-blue-400">
            <span>For developers, auditors and customers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Send transfers with strict ACID guarantees
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Each transaction is journaled with paired signed ledger entries. Know the balance is mathematically reconciled.
            Not just that an API returned 200.
          </p>
        </div>

        <div className="space-y-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Smart Ledger Intelligence
              </h3>
            </div>
            <div className="hidden sm:block">
              <RobotMascotCanvas isDancing={true} className="w-20 h-24" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 group-hover:scale-105 transition-all">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Auto-Reconcile Everything</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every holding balance is calculated from SUM(ledger_entry). The automated reconciliation worker continuous-audits all account-asset pairs.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <Zap className="w-3 h-3 text-blue-400" />
                  0.25ms reconciliation latency
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 group-hover:scale-105 transition-all">
                  <History className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Immutable Ledger Entries</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  PostgreSQL triggers strictly reject UPDATE and DELETE on ledger rows. Financial history cannot be tampered with or modified in place.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <Shield className="w-3 h-3 text-blue-400" />
                  100% append-only audit trail
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 group-hover:scale-105 transition-all">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Linked Reversal Entries</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Corrections and disputes never delete history. A compensating entry with an explicit reverse reference cleanly resets balances.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                  Zero history corruption
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Advanced Transaction Controls
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 transition-all">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Rule-Based Screening</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluates recipient KYC, velocity limits, and daily caps before confirmation. Stored with rule version &amp; plain reasons.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <Zap className="w-3 h-3 text-blue-400" />
                  Sub-millisecond screening
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 transition-all">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Role-Based Security &amp; RLS</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Granular roles for CUSTOMER, ADMIN, and AUDITOR. PostgreSQL Row-Level Security restricts customer reads strictly to their own rows.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <Shield className="w-3 h-3 text-blue-400" />
                  Database-level boundary
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 transition-all">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Idempotent Retry Safety</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Scoped UUID idempotency keys with SHA-256 fingerprint prevent accidental double execution on network timeouts or retries.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                  Exact-once transfers
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 transition-all">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Privacy-Aware Access Logs</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every staff read of customer data logs a purpose code. Auditor views automatically mask customer names, phones, and addresses.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <Shield className="w-3 h-3 text-blue-400" />
                  Zero PII leakage
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Analytics &amp; Invariants
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 transition-all">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Live Invariant Telemetry</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time Server-Sent Events (SSE) stream broadcasts balance updates, transfer completions, and active market reference prices.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <Zap className="w-3 h-3 text-blue-400" />
                  SSE Event Stream
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 transition-all">
                  <PieChart className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">High-Precision Accounting</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  NUMERIC(38,18) enforces asset-specific scale (BTC=8, ETH=18, Stocks=4). Floating-point roundoff errors are structurally impossible.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                  Exact 18-decimal precision
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 transition-all">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Developer Download Center</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download production PostgreSQL 16 schema SQL, the 125-customer master dataset CSV, and OpenAPI 3.1 specifications.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                  <DownloadCloud className="w-3 h-3 text-blue-400" />
                  Instant DDL &amp; CSV export
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
