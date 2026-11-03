'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  Filter,
  RefreshCw,
  ShieldAlert,
  UserCheck,
  Calendar,
  Lock,
} from 'lucide-react';

export default function AuditorAccessLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purposeFilter, setPurposeFilter] = useState('');

  const fetchAccessLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (purposeFilter) params.set('purposeCode', purposeFilter);

      const res = await fetch(`/api/auditor/access-logs?${params.toString()}`);
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessLogs();
  }, [purposeFilter]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-400 font-semibold">
              PRIVACY COMPLIANCE AUDITING
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              access_log &bull; Purpose-Coded Reads
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Staff Access Log Viewer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Independent regulatory verification of staff queries against customer personally identifiable information (PII).
          </p>
        </div>

        <Link
          href="/auditor/dashboard"
          className="text-xs font-mono text-blue-400 hover:text-blue-300"
        >
          &larr; Back to Auditor Dashboard
        </Link>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-[#182030] flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Purpose Filter:</span>
        </div>

        <select
          value={purposeFilter}
          onChange={(e) => setPurposeFilter(e.target.value)}
          className="bg-slate-900 border border-[#182030] rounded-lg px-2.5 py-1.5 text-slate-300 focus:border-amber-500"
        >
          <option value="">All Purpose Codes</option>
          <option value="KYC_VERIFICATION">KYC_VERIFICATION</option>
          <option value="FRAUD_INVESTIGATION">FRAUD_INVESTIGATION</option>
          <option value="CUSTOMER_SUPPORT_INQUIRY">CUSTOMER_SUPPORT_INQUIRY</option>
          <option value="COURT_ORDER_LEGAL">COURT_ORDER_LEGAL</option>
          <option value="AUDIT_COMPLIANCE_REVIEW">AUDIT_COMPLIANCE_REVIEW</option>
        </select>

        <div className="ml-auto">
          <button
            onClick={fetchAccessLogs}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-[#182030] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400 inline mr-2" />
            Querying PostgreSQL Staff Access Log...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            No access log records found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c101a] border-b border-[#182030] text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Access ID</th>
                  <th className="py-3 px-4 font-semibold">Staff Member</th>
                  <th className="py-3 px-4 font-semibold">Staff Role</th>
                  <th className="py-3 px-4 font-semibold">Data Category</th>
                  <th className="py-3 px-4 font-semibold">Purpose Code</th>
                  <th className="py-3 px-4 font-semibold">Resource ID</th>
                  <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.log_id || log.access_id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-amber-400 font-bold">
                      ACC-{log.log_id || log.access_id}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {log.staff_name || `Staff #${log.staff_id}`}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {log.staff_role || 'ADMIN'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-blue-400">
                      {log.data_category || 'CUSTOMER_PII'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800 text-amber-400 text-[10px] font-bold">
                        {log.purpose_code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      Cust #{log.resource_id}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(log.accessed_at).toLocaleString()}
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
