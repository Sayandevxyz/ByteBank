import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Database, Layers, Lock, Scale, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About ByteBank | DBMS Architecture & Digital Asset Ledger',
  description: 'Learn about the relational database architecture, ACID guarantees, and double-entry invariants behind the ByteBank platform.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-[#060911] text-white min-h-screen">
      <section className="relative w-full pt-16 pb-16 bg-[#080d18] border-b border-white/[0.06] text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1424] border border-blue-500/30 text-xs font-mono text-blue-400 mb-6 shadow-glow-blue">
            <span>DBMS Architecture &amp; Database Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            About ByteBank
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A production-grade digital asset management and transaction ledger platform engineered directly on PostgreSQL 16.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Relational Database Foundation
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              ByteBank stores and tracks digital assets (simulated crypto and equities) and transactions. Built in 3NF and BCNF, every table uses strictly typed PostgreSQL features: NUMERIC(38,18) precision, foreign keys with referential actions, custom ENUM types, and timestamptz audit timestamps.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              No heavy ORMs obscure the SQL. Triggers enforce append-only immutability on the double-entry ledger, stored procedures coordinate serializable ACID transfers, and database views mask sensitive customer PII for auditor roles.
            </p>
          </div>

          <div className="bg-[#0c1220] rounded-2xl p-8 border border-white/[0.08] space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-glow-blue">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">PostgreSQL 16 Native Engine</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Row-level locks (SELECT ... FOR UPDATE) prevent double-spend concurrency anomalies without application-level race windows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-glow-blue">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Strict Double-Entry Ledger</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Balances are not arbitrary mutable counters. Holding equals SUM(ledger_entry), continuously checked by automated reconciliation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-glow-blue">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Rule-Based Risk Screening</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every transfer assessment evaluates versioned rules, recording immutable audit records for regulatory oversight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#080d18] border-y border-white/[0.06] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              5 Non-Negotiable Database Invariants
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Guaranteed by PostgreSQL triggers, constraints, and isolation levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0c1220] rounded-2xl p-6 border border-white/[0.08] hover:border-blue-500/30 transition-all">
              <div className="text-blue-400 font-mono text-xs font-bold mb-2">INVARIANT 1</div>
              <h3 className="text-base font-bold text-white mb-2">Zero Balance Drift</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Holding balance is mathematically identical to the sum of all historic ledger entries. Verified continuously by the reconciliation worker.
              </p>
            </div>

            <div className="bg-[#0c1220] rounded-2xl p-6 border border-white/[0.08] hover:border-blue-500/30 transition-all">
              <div className="text-blue-400 font-mono text-xs font-bold mb-2">INVARIANT 2</div>
              <h3 className="text-base font-bold text-white mb-2">Append-Only Immutability</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The trg_ledger_immutable() database trigger raises an exception on any UPDATE or DELETE attempt on ledger rows.
              </p>
            </div>

            <div className="bg-[#0c1220] rounded-2xl p-6 border border-white/[0.08] hover:border-blue-500/30 transition-all">
              <div className="text-blue-400 font-mono text-xs font-bold mb-2">INVARIANT 3</div>
              <h3 className="text-base font-bold text-white mb-2">Atomic Reservations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Available balance = total &minus; active reservations. Double spend attempts lock rows with SELECT ... FOR UPDATE and fail gracefully.
              </p>
            </div>

            <div className="bg-[#0c1220] rounded-2xl p-6 border border-white/[0.08] hover:border-blue-500/30 transition-all">
              <div className="text-blue-400 font-mono text-xs font-bold mb-2">INVARIANT 4</div>
              <h3 className="text-base font-bold text-white mb-2">Idempotent Retry Safety</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A unique constraint on customer_id + idempotency_key with a SHA-256 fingerprint guarantees exact-once execution semantics.
              </p>
            </div>

            <div className="bg-[#0c1220] rounded-2xl p-6 border border-white/[0.08] hover:border-blue-500/30 transition-all">
              <div className="text-blue-400 font-mono text-xs font-bold mb-2">INVARIANT 5</div>
              <h3 className="text-base font-bold text-white mb-2">Privacy-Aware Access Logging</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Staff reads of customer records write access_log rows with purpose codes. Auditor roles see only masked account numbers and zero PII.
              </p>
            </div>

            <div className="bg-[#0c1220] rounded-2xl p-6 border border-blue-500/30 bg-blue-950/20 flex flex-col justify-between">
              <div>
                <div className="text-emerald-400 font-mono text-xs font-bold mb-2">LIVE VERIFICATION</div>
                <h3 className="text-base font-bold text-white mb-2">Test Database Invariants</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open the interactive DBMS Concurrency Lab to simulate parallel race conditions against PostgreSQL 16 row locks.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/admin/lab"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow-blue transition-all"
                >
                  <span>Launch Concurrency Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
