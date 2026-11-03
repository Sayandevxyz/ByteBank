'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Zap,
  ShieldAlert,
  RotateCcw,
  Scale,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Lock,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function DbmsLabPage() {
  const [activeTab, setActiveTab] = useState<'concurrency' | 'idempotency' | 'crash' | 'drift'>(
    'concurrency'
  );

  const [concurrencyLoading, setConcurrencyLoading] = useState(false);
  const [concurrencyResult, setConcurrencyResult] = useState<any | null>(null);

  const [idempotencyLoading, setIdempotencyLoading] = useState(false);
  const [idempotencyResult, setIdempotencyResult] = useState<any | null>(null);

  const [crashLoading, setCrashLoading] = useState(false);
  const [crashResult, setCrashResult] = useState<any | null>(null);

  const [driftLoading, setDriftLoading] = useState(false);
  const [driftResult, setDriftResult] = useState<any | null>(null);

  const runConcurrencyLab = async () => {
    try {
      setConcurrencyLoading(true);
      setConcurrencyResult(null);
      const res = await fetch('/api/lab/concurrency', { method: 'POST' });
      const data = await res.json();
      setConcurrencyResult(data);
    } catch (e: any) {
      setConcurrencyResult({ error: e.message });
    } finally {
      setConcurrencyLoading(false);
    }
  };

  const runIdempotencyLab = async (action: 'exact_retry' | 'conflict_body' | 'concurrent') => {
    try {
      setIdempotencyLoading(true);
      setIdempotencyResult(null);
      const res = await fetch('/api/lab/idempotency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: action }),
      });
      const data = await res.json();
      setIdempotencyResult(data);
    } catch (e: any) {
      setIdempotencyResult({ error: e.message });
    } finally {
      setIdempotencyLoading(false);
    }
  };

  const runCrashLab = async () => {
    try {
      setCrashLoading(true);
      setCrashResult(null);
      const res = await fetch('/api/lab/crash-rollback', { method: 'POST' });
      const data = await res.json();
      setCrashResult(data);
    } catch (e: any) {
      setCrashResult({ error: e.message });
    } finally {
      setCrashLoading(false);
    }
  };

  const runDriftLab = async (step: 'inject' | 'reconcile' | 'fix') => {
    try {
      setDriftLoading(true);
      const res = await fetch('/api/lab/reconciliation-drift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: step }),
      });
      const data = await res.json();
      setDriftResult(data);
    } catch (e: any) {
      setDriftResult({ error: e.message });
    } finally {
      setDriftLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-400 font-semibold">
              ACADEMIC VERIFICATION SUITE
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              Interactive Invariant Playground
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Interactive DBMS Lab</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual lab for professors, auditors, and engineers to stress-test transaction atomicity, row locks, idempotency keys, and crash rollbacks.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="text-xs font-mono text-blue-400 hover:text-blue-300"
        >
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900 border border-[#182030]">
        <button
          onClick={() => setActiveTab('concurrency')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'concurrency'
              ? 'bg-purple-600 text-white shadow-glow-blue'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          1. Concurrency Race
        </button>

        <button
          onClick={() => setActiveTab('idempotency')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'idempotency'
              ? 'bg-purple-600 text-white shadow-glow-blue'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          2. Idempotency &amp; Retries
        </button>

        <button
          onClick={() => setActiveTab('crash')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'crash'
              ? 'bg-purple-600 text-white shadow-glow-blue'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          3. Crash &amp; Autonomous Log
        </button>

        <button
          onClick={() => setActiveTab('drift')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'drift'
              ? 'bg-purple-600 text-white shadow-glow-blue'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          4. Drift &amp; Remediation
        </button>
      </div>

      {activeTab === 'concurrency' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Concurrent Double-Spend Race Condition
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Initial Balance = <span className="text-white font-mono font-bold">1.00000000 BTC</span>. Two simultaneous transfers for <span className="text-amber-400 font-mono font-bold">0.80000000 BTC</span> are launched on parallel database connections.
                </p>
              </div>

              <button
                onClick={runConcurrencyLab}
                disabled={concurrencyLoading}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold text-xs font-mono shadow-glow-blue transition-all flex items-center gap-2"
              >
                {concurrencyLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Firing Parallel PostgreSQL Connections...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Execute Concurrent Race
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#0c101a] border border-[#182030] font-mono text-xs text-slate-300 space-y-2">
              <div className="text-blue-400 font-bold">DBMS Invariant Under Test:</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                PostgreSQL row locks (<code className="text-blue-300">SELECT ... FOR UPDATE</code> ordered by <code className="text-blue-300">account_id, asset_id</code>) serialize the requests. The first transaction locks the holding and debits 0.8 BTC (remaining balance = 0.2 BTC). The second transaction unblocks, revalidates available balance, and cleanly fails with <code className="text-rose-400">INSUFFICIENT_FUNDS</code>.
              </p>
            </div>
          </div>

          {concurrencyResult && (
            <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
                <span className="text-xs font-mono text-slate-400">Race Condition Execution Log</span>
                <span
                  className={`text-xs font-mono px-3 py-1 rounded font-bold ${
                    concurrencyResult.invariantMaintained
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {concurrencyResult.invariantMaintained
                    ? 'INVARIANT PRESERVED: ZERO DOUBLE SPEND'
                    : 'INVARIANT VIOLATED'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="p-4 rounded-xl bg-slate-900 border border-[#182030] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      Transaction Thread A (0.8 BTC)
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        concurrencyResult.threadA?.success
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {concurrencyResult.threadA?.status || 'FAILED'}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs text-slate-400">
                    <div>Tx ID: #{concurrencyResult.threadA?.transactionId || '---'}</div>
                    <div>Duration: {concurrencyResult.threadA?.durationMs}ms</div>
                    <div className="text-[11px] text-slate-300">
                      Message: {concurrencyResult.threadA?.message || concurrencyResult.threadA?.error}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-[#182030] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-purple-400" />
                      Transaction Thread B (0.8 BTC)
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        concurrencyResult.threadB?.success
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {concurrencyResult.threadB?.status || 'FAILED'}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs text-slate-400">
                    <div>Tx ID: #{concurrencyResult.threadB?.transactionId || '---'}</div>
                    <div>Duration: {concurrencyResult.threadB?.durationMs}ms</div>
                    <div className="text-[11px] text-slate-300">
                      Message: {concurrencyResult.threadB?.message || concurrencyResult.threadB?.error}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-[#182030] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500">PostgreSQL Verified Final Balance: </span>
                  <span className="text-white font-bold text-sm">
                    {concurrencyResult.finalBalance} BTC
                  </span>
                </div>
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Exact Mathematical Invariant (1.0 - 0.8 = 0.20000000 BTC)
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'idempotency' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-400" />
              Idempotency Key &amp; Request Fingerprint Verification
            </h2>
            <p className="text-xs text-slate-400">
              ByteBank scopes idempotency keys per customer with a SHA-256 parameter fingerprint. Test the 3 canonical API outcomes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => runIdempotencyLab('exact_retry')}
                disabled={idempotencyLoading}
                className="p-4 rounded-xl bg-slate-900 border border-[#182030] hover:border-blue-500 text-left space-y-2 transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-blue-400 font-mono flex items-center justify-between">
                  Scenario A: Identical Retry
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Same Key + Same Body &rarr; Returns cached result with <strong>IDEMPOTENT_REPLAY</strong> header without duplicate debits.
                </div>
              </button>

              <button
                onClick={() => runIdempotencyLab('conflict_body')}
                disabled={idempotencyLoading}
                className="p-4 rounded-xl bg-slate-900 border border-[#182030] hover:border-rose-500 text-left space-y-2 transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-rose-400 font-mono flex items-center justify-between">
                  Scenario B: Payload Conflict
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Same Key + Altered Amount &rarr; Returns <strong>409 Conflict</strong> with fingerprint hash mismatch explanation.
                </div>
              </button>

              <button
                onClick={() => runIdempotencyLab('concurrent')}
                disabled={idempotencyLoading}
                className="p-4 rounded-xl bg-slate-900 border border-[#182030] hover:border-amber-500 text-left space-y-2 transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400 font-mono flex items-center justify-between">
                  Scenario C: In-Flight Collision
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Same Key while request is in progress &rarr; Returns <strong>425 Too Early</strong> or 409 In Progress.
                </div>
              </button>
            </div>
          </div>

          {idempotencyResult && (
            <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
                <span className="text-slate-400">Idempotency Protocol Response</span>
                <span className="text-blue-400 font-bold">{idempotencyResult.scenario}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-[#182030] space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Idempotency Key:</span>
                  <span className="text-white">{idempotencyResult.idempotencyKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fingerprint SHA-256:</span>
                  <span className="text-blue-300 break-all">{idempotencyResult.fingerprint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">HTTP Status:</span>
                  <span
                    className={
                      idempotencyResult.status === 200
                        ? 'text-emerald-400 font-bold'
                        : idempotencyResult.status === 409
                        ? 'text-rose-400 font-bold'
                        : 'text-amber-400 font-bold'
                    }
                  >
                    {idempotencyResult.status} {idempotencyResult.statusText}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Result Message:</span>
                  <span className="text-slate-200">{idempotencyResult.message}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'crash' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  Crash Rollback &amp; Autonomous Failure Persistence
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Trigger an intentional mid-transaction abort (e.g. invalid status transition or constraint violation).
                </p>
              </div>

              <button
                onClick={runCrashLab}
                disabled={crashLoading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-bold text-xs font-mono shadow-glow-blue transition-all flex items-center gap-2"
              >
                {crashLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Simulating ACID Abort...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Trigger Transaction Crash
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#0c101a] border border-[#182030] font-mono text-xs text-slate-300 space-y-2">
              <div className="text-rose-400 font-bold">The Rollback Paradox:</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                In PostgreSQL, an aborted transaction rolls back <em>all</em> internal modifications (no ledger rows created, balances untouched). However, compliance and audit rules mandate that <strong>failed attempts must be logged</strong>. ByteBank solves this using an autonomous connection runner that logs the failure record and reason outside the aborted transaction.
              </p>
            </div>
          </div>

          {crashResult && (
            <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
                <span className="text-slate-400">Autonomous Failure Telemetry</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  ACID Atomicity &amp; Audit Maintained
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-[#182030] space-y-2">
                  <div className="text-rose-400 font-bold">Primary Posting Transaction:</div>
                  <div className="text-slate-400">Status: <span className="text-rose-400">ROLLED BACK</span></div>
                  <div className="text-slate-400">Balances Changed: <span className="text-emerald-400">0 (Zero Mutation)</span></div>
                  <div className="text-slate-400">Aborted Error: <span className="text-rose-300">{crashResult.abortedError}</span></div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-[#182030] space-y-2">
                  <div className="text-blue-400 font-bold">Autonomous Logging Path:</div>
                  <div className="text-slate-400">Persisted Tx ID: <span className="text-white font-bold">#{crashResult.loggedTransactionId}</span></div>
                  <div className="text-slate-400">Recorded Status: <span className="text-rose-400 font-bold">FAILED</span></div>
                  <div className="text-slate-400">Failure Reason: <span className="text-slate-200">{crashResult.loggedFailureReason}</span></div>
                  <div className="text-slate-400">Audit Log Row: <span className="text-emerald-400">Committed to audit_log</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'drift' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" />
              Reconciliation Drift Injection &amp; Compensating Resolution
            </h2>
            <p className="text-xs text-slate-400">
              Demonstrate how ByteBank detects out-of-band balance anomalies without ever mutating historical ledger records:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => runDriftLab('inject')}
                disabled={driftLoading}
                className="p-4 rounded-xl bg-slate-900 border border-[#182030] hover:border-amber-500 text-left space-y-2 transition-all group"
              >
                <div className="text-xs font-bold text-amber-400 font-mono">
                  Step 1: Inject Drift
                </div>
                <div className="text-[11px] text-slate-400">
                  Deliberately introduce +5.00 holding variance into an account to simulate database drift.
                </div>
              </button>

              <button
                onClick={() => runDriftLab('reconcile')}
                disabled={driftLoading}
                className="p-4 rounded-xl bg-slate-900 border border-[#182030] hover:border-blue-500 text-left space-y-2 transition-all group"
              >
                <div className="text-xs font-bold text-blue-400 font-mono">
                  Step 2: Run Reconciliation
                </div>
                <div className="text-[11px] text-slate-400">
                  Execute <code className="text-blue-300">run_reconciliation()</code> to detect drift and create a <code className="text-blue-300">reconciliation_issue</code>.
                </div>
              </button>

              <button
                onClick={() => runDriftLab('fix')}
                disabled={driftLoading}
                className="p-4 rounded-xl bg-slate-900 border border-[#182030] hover:border-emerald-500 text-left space-y-2 transition-all group"
              >
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  Step 3: Compensating Reversal
                </div>
                <div className="text-[11px] text-slate-400">
                  Execute <code className="text-emerald-300">reconcile_fix_issue()</code> to insert a linked reversal ledger entry without editing history!
                </div>
              </button>
            </div>
          </div>

          {driftResult && (
            <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
                <span className="text-slate-400">Reconciliation Step Result</span>
                <span className="text-teal-400 font-bold">{driftResult.action}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-[#182030] space-y-2 text-slate-300">
                <div>Message: {driftResult.message}</div>
                {driftResult.variance && <div>Detected Variance: <span className="text-amber-400 font-bold">{driftResult.variance}</span></div>}
                {driftResult.issueId && <div>Open Issue ID: <span className="text-blue-300">ISSUE-{driftResult.issueId}</span></div>}
                {driftResult.reversalEntryId && <div>Compensating Ledger Entry: <span className="text-emerald-400 font-bold">ENTRY-{driftResult.reversalEntryId}</span></div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
