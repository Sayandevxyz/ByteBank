'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Filter,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export default function AuditorAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (actionFilter) params.set('action', actionFilter);
      if (resourceFilter) params.set('resource', resourceFilter);

      const res = await fetch(`/api/auditor/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter, resourceFilter]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-400 font-semibold">
              APPEND-ONLY AUDIT TRAIL
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              audit_log &bull; Trigger Automated
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Immutable Audit Log Inspector</h1>
          <p className="text-xs text-slate-400 mt-1">
            All mutating database operations automatically capture before-and-after states with zero-PII masking.
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
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span>Filters:</span>
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-slate-900 border border-[#182030] rounded-lg px-2.5 py-1.5 text-slate-300 focus:border-purple-500"
        >
          <option value="">All Actions</option>
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="bg-slate-900 border border-[#182030] rounded-lg px-2.5 py-1.5 text-slate-300 focus:border-purple-500"
        >
          <option value="">All Resources</option>
          <option value="customer">customer</option>
          <option value="account">account</option>
          <option value="asset">asset</option>
          <option value="risk_rule">risk_rule</option>
          <option value="reconciliation_issue">reconciliation_issue</option>
        </select>

        <div className="ml-auto">
          <button
            onClick={fetchAuditLogs}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-[#182030] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-400 inline mr-2" />
            Querying PostgreSQL Immutable Audit Log...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            No audit log entries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c101a] border-b border-[#182030] text-slate-400">
                <tr>
                  <th className="py-3 px-4 w-8"></th>
                  <th className="py-3 px-4 font-semibold">Log ID</th>
                  <th className="py-3 px-4 font-semibold">Actor</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Resource Target</th>
                  <th className="py-3 px-4 font-semibold">Request Ref</th>
                  <th className="py-3 px-4 font-semibold text-right">Captured At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => {
                  const isExpanded = expandedLogId === log.log_id;
                  return (
                    <React.Fragment key={log.log_id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.log_id)}
                        className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 text-slate-500">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </td>
                        <td className="py-3 px-4 text-purple-400 font-bold">
                          LOG-{log.log_id}
                        </td>
                        <td className="py-3 px-4 text-white font-medium">
                          {log.actor || 'system'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.action === 'INSERT'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : log.action === 'UPDATE'
                                ? 'bg-[#111c33] text-blue-400 border border-blue-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-200">
                          {log.resource}
                          {log.resource_id && (
                            <span className="text-slate-500 text-[10px] ml-1">
                              (#{log.resource_id})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400 truncate max-w-[160px]">
                          {log.request_ref || 'INTERNAL_TRIGGER'}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                          {new Date(log.created_at || log.at).toLocaleString()}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-950/80">
                          <td colSpan={7} className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase text-rose-400 font-bold">
                                  Previous State (old_value):
                                </span>
                                <pre className="p-3 rounded-lg bg-slate-900 border border-[#182030] text-[11px] text-slate-400 overflow-x-auto max-h-48">
                                  {log.old_value
                                    ? JSON.stringify(log.old_value, null, 2)
                                    : 'null (New entity inserted)'}
                                </pre>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] uppercase text-emerald-400 font-bold">
                                  Mutated State (new_value - Masked):
                                </span>
                                <pre className="p-3 rounded-lg bg-slate-900 border border-[#182030] text-[11px] text-emerald-300 overflow-x-auto max-h-48">
                                  {log.new_value
                                    ? JSON.stringify(log.new_value, null, 2)
                                    : 'null (Entity removed)'}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
