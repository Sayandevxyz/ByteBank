'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Layers,
  Database,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  success: '#10b981',
  pending: '#f59e0b',
  failed: '#ef4444',
  rejected: '#a855f7',
};

const RISK_COLORS: Record<string, string> = {
  ALLOW: '#10b981',
  REQUIRE_EXTRA_CONFIRMATION: '#f59e0b',
  REJECT: '#ef4444',
};

export default function AuditorReportsPage() {
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
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
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-400 font-mono text-sm">
        <RefreshCw className="w-4 h-4 animate-spin text-blue-400 mr-2" />
        Aggregating Compliance Views from PostgreSQL...
      </div>
    );
  }

  const failedByMonth = reports?.failedByMonth || [];
  const statusBreakdown = (reports?.statusBreakdown || []).map((s: any) => ({
    name: s.status.toUpperCase(),
    value: parseInt(s.count, 10),
    percentage: parseFloat(s.percentage).toFixed(1),
    statusKey: s.status,
  }));

  const assetVolumes = (reports?.assetVolumes || []).map((a: any) => ({
    symbol: a.symbol,
    type: a.type,
    volume: parseFloat(a.total_simulated_volume_sru),
    txnCount: parseInt(a.txn_count, 10),
  }));

  const riskStats = (reports?.riskStats || []).map((r: any) => ({
    name: r.outcome,
    value: parseInt(r.count, 10),
  }));

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#111c33] border border-blue-800 text-blue-400 font-semibold">
              COMPLIANCE ANALYTICS
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              v_failed_by_month &bull; risk_assessment
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Regulatory Reports &amp; Trends</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual telemetry on transaction success rates, risk rule distributions, and failed transaction cause clustering.
          </p>
        </div>

        <Link
          href="/auditor/dashboard"
          className="text-xs font-mono text-blue-400 hover:text-blue-300"
        >
          &larr; Back to Auditor Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-400" />
              Transaction Outcome Distribution
            </h2>
            <span className="text-xs font-mono text-slate-500">PostgreSQL Status Enum</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusBreakdown.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.statusKey] || '#64748b'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend
                  formatter={(val, entry: any) => (
                    <span className="text-xs font-mono text-slate-300">
                      {val} ({entry.payload.value})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Risk Screening Outcomes
            </h2>
            <span className="text-xs font-mono text-slate-500">assess_transfer_risk()</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskStats}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[6, 6, 0, 0]}>
                  {riskStats.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RISK_COLORS[entry.name] || '#06b6d4'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Simulated Reference Volume by Asset (SRU / USD Equivalent)
          </h2>
          <span className="text-xs font-mono text-slate-500">quantity &times; sim_ref_price</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetVolumes}>
              <XAxis dataKey="symbol" stroke="#64748b" fontSize={12} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Simulated Volume']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="volume" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-[#182030] overflow-hidden space-y-4">
        <div className="p-4 bg-[#0c101a] border-b border-[#182030] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-400" />
              Failed &amp; Rejected Transactions by Month (v_failed_by_month)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Materialized aggregation of transaction rejections, grouped by calendar month and failure reason codes.
            </p>
          </div>
        </div>

        {failedByMonth.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs font-mono">
            No failed transactions recorded in monthly aggregate view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/40 text-slate-400 border-b border-[#182030]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Calendar Month</th>
                  <th className="py-2.5 px-4 font-semibold">Outcome Status</th>
                  <th className="py-2.5 px-4 font-semibold">Failure Reason / Violation</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Occurrence Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {failedByMonth.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-bold text-white">
                      {new Date(row.month).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          row.status === 'rejected'
                            ? 'bg-purple-950 text-purple-400 border border-purple-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {row.failure_reason || 'Unknown constraint failure'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-white">
                      {row.n}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
