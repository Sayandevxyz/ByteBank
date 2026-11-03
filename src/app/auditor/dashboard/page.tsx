'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ShieldCheck,
  Eye,
  FileText,
  Activity,
  Layers,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Lock,
} from 'lucide-react';

const NetworkGraphCanvas = dynamic(() => import('../../../components/canvas/NetworkGraphCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full flex items-center justify-center text-slate-500 text-xs font-mono">
      Loading 3D Auditor Network Topology...
    </div>
  ),
});

export default function AuditorDashboardPage() {
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAuditorData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auditor/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditorData();
  }, []);

  const totals = reports?.totals || {};
  const statusBreakdown = reports?.statusBreakdown || [];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold">
              ROLE: BYTEBANK_AUDITOR
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              Read-Only &amp; Zero-PII Enforced
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Regulatory &amp; Compliance Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Read-only, privacy-masked oversight of all system transactions, immutable audit trails, and staff access logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auditor/reports"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-glow transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            View Analytics Reports
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Audited Transactions
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totals.total_transactions || '0'}
          </div>
          <div className="text-[10px] text-slate-500">Accessible via v_auditor_transactions</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Immutable Ledger Rows
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {totals.total_ledger_entries || '0'}
          </div>
          <div className="text-[10px] text-slate-500">Trigger-guarded immutability</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-purple-400" /> System Audit Logs
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totals.total_audit_logs || '0'}
          </div>
          <div className="text-[10px] text-slate-500">Capture of all DB mutations</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-amber-400" /> Staff Access Logs
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {totals.total_access_logs || '0'}
          </div>
          <div className="text-[10px] text-slate-500">Purpose-coded read telemetry</div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Auditor Graph Topology (Masked Identity Nodes)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Force-directed 3D topology of transaction flows with customer PII stripped at the database level.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded bg-slate-900 border border-slate-800">
            SELECT * FROM v_auditor_transactions
          </span>
        </div>

        <div className="h-96 w-full rounded-xl overflow-hidden bg-slate-950/60 border border-slate-900 relative">
          <NetworkGraphCanvas />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/auditor/transactions"
          className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/50 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            Masked Transactions
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400">
            Browse all transfers and swaps without exposing customer names, phone numbers, addresses, or identifiers.
          </p>
        </Link>

        <Link
          href="/auditor/audit-logs"
          className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/50 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            Immutable Audit Trail
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400">
            Inspect trigger-generated audit records capturing table mutations with old and new values.
          </p>
        </Link>

        <Link
          href="/auditor/access-logs"
          className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/50 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            Staff Access Log
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400">
            Audit staff queries against customer PII, verifying purpose codes, timestamps, and request references.
          </p>
        </Link>

        <Link
          href="/auditor/reports"
          className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/50 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            Compliance Analytics
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400">
            Interactive charts on failed transaction causes, monthly volumes, and risk screening distributions.
          </p>
        </Link>
      </div>
    </div>
  );
}
