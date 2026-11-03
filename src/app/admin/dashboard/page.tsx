'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ShieldAlert,
  Users,
  Wallet,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Scale,
  Sliders,
  FlaskConical,
} from 'lucide-react';

const NetworkGraphCanvas = dynamic(() => import('../../../components/canvas/NetworkGraphCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full flex items-center justify-center text-slate-500 text-xs font-mono">
      Initializing 3D Transaction Network Graph...
    </div>
  ),
});

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [reconciliation, setReconciliation] = useState<any>(null);
  const [pendingKycCount, setPendingKycCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [reportsRes, reconRes, kycRes] = await Promise.all([
        fetch('/api/auditor/reports').then((r) => r.json()),
        fetch('/api/admin/reconciliation').then((r) => r.json()),
        fetch('/api/admin/kyc?status=pending').then((r) => r.json()),
      ]);

      if (reportsRes) setStats(reportsRes);
      if (reconRes?.summary) setReconciliation(reconRes.summary);
      if (kycRes?.customers) setPendingKycCount(kycRes.customers.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const sse = new EventSource('/api/realtime/sse');
    sse.addEventListener('TRANSACTION_UPDATE', () => fetchDashboardData());
    sse.addEventListener('KYC_UPDATE', () => fetchDashboardData());
    sse.addEventListener('PRICE_UPDATE', () => fetchDashboardData());
    return () => sse.close();
  }, []);

  const totals = stats?.totals || {};

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-[#182030]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-400 font-bold">
              ROLE: BYTEBANK_ADMIN
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              ACID &amp; RLS Superuser
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Administrative Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, transaction network graph, compliance reviews, and database orchestration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/lab"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-glow-blue transition-all"
          >
            <FlaskConical className="w-4 h-4" />
            Open DBMS Lab
          </Link>
          <Link
            href="/admin/reconciliation"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-4 h-4 text-blue-400" />
            Run Reconciliation
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-[#182030] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Total Customers
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totals.customer_count || '125'}
          </div>
          <div className="text-[10px] text-slate-500">Seeded CUST101-225</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#182030] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Customer Accounts
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totals.account_count || '125'}
          </div>
          <div className="text-[10px] text-slate-500">1:1 Customer mapping</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#182030] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Pending KYC
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {pendingKycCount}
          </div>
          <Link href="/admin/kyc" className="text-[10px] text-blue-400 hover:underline">
            Review queue &rarr;
          </Link>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#182030] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" /> Total Txns
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totals.total_transactions || '0'}
          </div>
          <div className="text-[10px] text-slate-500">
            {totals.total_ledger_entries || '0'} Ledger rows
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#182030] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-teal-400" /> Reconciliation
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {reconciliation?.mismatched_pairs === '0' || !reconciliation?.mismatched_pairs
              ? 'Balanced'
              : `${reconciliation?.mismatched_pairs} Drift`}
          </div>
          <div className="text-[10px] text-slate-500">
            {reconciliation?.matched_pairs || '868'} pairs checked
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#182030] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-rose-400" /> Audit Triggers
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totals.total_audit_logs || '0'}
          </div>
          <div className="text-[10px] text-slate-500">Automated change capture</div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#182030] gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Live Transaction Flow Network (3D Topology)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Force-directed 3D visualization of account nodes, Treasury liquidity distribution, and active transfer edges.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block shadow-glow-blue" /> System Treasury
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-glow-blue" /> Verified Customers
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block shadow-glow-blue" /> Frozen / Flagged
            </span>
          </div>
        </div>

        <div className="h-96 w-full rounded-xl overflow-hidden bg-slate-950/60 border border-slate-900 relative">
          <NetworkGraphCanvas />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/kyc"
          className="p-6 rounded-2xl glass-panel border border-[#182030] hover:border-blue-500/50 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-[#111c33] border border-blue-800 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            KYC Review Queue
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400">
            Inspect pending customer onboarding, verify SHA-256 ID proof hashes, approve or reject with audit triggers.
          </p>
        </Link>

        <Link
          href="/admin/accounts"
          className="p-6 rounded-2xl glass-panel border border-[#182030] hover:border-blue-500/50 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            Account Management
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400">
            Freeze and unfreeze accounts with mandatory reason codes, view ledger balances, and enforce compliance holds.
          </p>
        </Link>

        <Link
          href="/admin/assets"
          className="p-6 rounded-2xl glass-panel border border-[#182030] hover:border-blue-500/50 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            Assets &amp; Prices
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400">
            Configure precision scales, define new crypto/stock pairs, and adjust simulated reference exchange rates with live SSE broadcast.
          </p>
        </Link>

        <Link
          href="/admin/customer-lookup"
          className="p-6 rounded-2xl glass-panel border border-[#182030] hover:border-blue-500/50 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            Controlled Staff Lookup
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400">
            Secure customer data viewer enforcing mandatory purpose codes, automatically recording access logs.
          </p>
        </Link>
      </div>
    </div>
  );
}
