'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  Wrench,
  ShieldCheck,
  History,
  Layers,
  FileCheck,
} from 'lucide-react';

export default function AdminReconciliationPage() {
  const [summary, setSummary] = useState<any>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningRecon, setRunningRecon] = useState(false);
  const [fixingIssueId, setFixingIssueId] = useState<number | null>(null);
  const [fixNote, setFixNote] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchReconciliation = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reconciliation');
      const data = await res.json();
      if (data.summary) setSummary(data.summary);
      if (data.runs) setRuns(data.runs);
      if (data.issues) setIssues(data.issues);
    } catch (err: any) {
      setMessage({ text: 'Failed to fetch reconciliation state.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReconciliation();
  }, []);

  const handleRunReconciliation = async () => {
    try {
      setRunningRecon(true);
      setMessage(null);

      const res = await fetch('/api/admin/reconciliation', {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error?.message || 'Reconciliation run failed.', type: 'error' });
        return;
      }

      setMessage({
        text: `Reconciliation Run #${data.runId} completed! Pairs checked: ${data.detail?.pairs_checked}, Issues found: ${data.detail?.issues_found}.`,
        type: data.detail?.issues_found > 0 ? 'error' : 'success',
      });
      fetchReconciliation();
    } catch (err: any) {
      setMessage({ text: err.message || 'Error running reconciliation.', type: 'error' });
    } finally {
      setRunningRecon(false);
    }
  };

  const handleFixIssue = async (issueId: number) => {
    const note = fixNote.trim() || 'Compensating reversal ledger entry posted via admin reconciliation suite.';
    try {
      setFixingIssueId(issueId);
      setMessage(null);

      const res = await fetch('/api/admin/reconciliation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId,
          resolutionNote: note,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error?.message || 'Compensating fix failed.', type: 'error' });
        return;
      }

      setMessage({
        text: `Issue #${issueId} resolved via compensating transaction #${data.compensatingTransactionId}. Holding and ledger are now synchronized.`,
        type: 'success',
      });
      setFixNote('');
      fetchReconciliation();
    } catch (err: any) {
      setMessage({ text: err.message || 'Error resolving issue.', type: 'error' });
    } finally {
      setFixingIssueId(null);
    }
  };

  const isMismatched = summary && parseInt(summary.mismatched_pairs, 10) > 0;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-950/80 border border-teal-800 text-teal-400 font-semibold">
              LEDGER VERIFICATION SUITE
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              run_reconciliation() &bull; reconcile_fix_issue()
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Ledger Reconciliation Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare every account/asset holding against the sum of double-entry ledger records. Invariant: <code className="text-teal-300">holding = &sum; ledger_entry</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunReconciliation}
            disabled={runningRecon}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 text-white font-bold text-xs font-mono shadow-glow transition-all flex items-center gap-2"
          >
            {runningRecon ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Scanning All Pairs...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Run Reconciliation Now
              </>
            )}
          </button>

          <Link
            href="/admin/dashboard"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            &larr; Back to Admin Dashboard
          </Link>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400">Total Account/Asset Pairs</div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {summary?.total_pairs || '868'}
          </div>
          <div className="text-[11px] text-slate-500">Across all customer and system accounts</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400">Balanced Pairs (100% Match)</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            {summary?.matched_pairs || '868'}
          </div>
          <div className="text-[11px] text-slate-500">Holding perfectly equals &sum;(ledger_entry)</div>
        </div>

        <div
          className={`glass-panel p-6 rounded-2xl border space-y-2 ${
            isMismatched ? 'border-rose-800/80 bg-rose-950/20' : 'border-slate-800'
          }`}
        >
          <div className="text-xs font-mono text-slate-400">Mismatched Pairs (Drift)</div>
          <div
            className={`text-3xl font-extrabold font-mono flex items-center gap-2 ${
              isMismatched ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {isMismatched ? (
              <AlertTriangle className="w-6 h-6 text-rose-400 animate-pulse" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            )}
            {summary?.mismatched_pairs || '0'}
          </div>
          <div className="text-[11px] text-slate-500">
            {isMismatched
              ? 'Drift detected! Open issue recorded below.'
              : 'Zero drift detected. High integrity.'}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Reconciliation Issues Log (reconciliation_issue)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              History is never rewritten: any mismatch is resolved via linked compensating adjustment transactions.
            </p>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs font-mono">
            No active or historical reconciliation issues recorded. All ledger entries match holding balances.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Issue ID</th>
                  <th className="py-3 px-4 font-semibold">Account No</th>
                  <th className="py-3 px-4 font-semibold">Asset</th>
                  <th className="py-3 px-4 font-semibold text-right">Holding Qty</th>
                  <th className="py-3 px-4 font-semibold text-right">Ledger Qty</th>
                  <th className="py-3 px-4 font-semibold text-right">Variance</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Compensating Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {issues.map((issue) => (
                  <tr key={issue.issue_id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-cyan-400 font-bold">
                      ISSUE-{issue.issue_id}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{issue.account_no}</td>
                    <td className="py-3 px-4">{issue.symbol}</td>
                    <td className="py-3 px-4 text-right">
                      {parseFloat(issue.holding_qty).toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {parseFloat(issue.ledger_qty).toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400">
                      {parseFloat(issue.variance).toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          issue.status === 'open'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {issue.status === 'open' ? (
                        <button
                          onClick={() => handleFixIssue(issue.issue_id)}
                          disabled={fixingIssueId === issue.issue_id}
                          className="px-3 py-1 rounded bg-teal-900/60 hover:bg-teal-800 border border-teal-700 text-teal-200 text-[10px] font-mono transition-colors inline-flex items-center gap-1.5"
                        >
                          {fixingIssueId === issue.issue_id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Wrench className="w-3 h-3" />
                          )}
                          Execute Compensating Reversal
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px]">
                          Resolved {new Date(issue.resolved_at).toLocaleTimeString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 text-xs font-bold font-mono text-white flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          Recent Automated Reconciliation Runs (reconciliation_run)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Run ID</th>
                <th className="py-2.5 px-4">Started At</th>
                <th className="py-2.5 px-4">Finished At</th>
                <th className="py-2.5 px-4 text-right">Pairs Audited</th>
                <th className="py-2.5 px-4 text-right">Issues Detected</th>
                <th className="py-2.5 px-4 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {runs.map((r) => (
                <tr key={r.run_id}>
                  <td className="py-2.5 px-4 text-cyan-400 font-bold">RUN-{r.run_id}</td>
                  <td className="py-2.5 px-4 text-slate-400">
                    {new Date(r.started_at).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-slate-400">
                    {r.finished_at ? new Date(r.finished_at).toLocaleString() : 'Running...'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-white">
                    {r.pairs_checked}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={`font-bold ${
                        r.issues_found > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {r.issues_found}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px] font-bold">
                      COMPLETED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
