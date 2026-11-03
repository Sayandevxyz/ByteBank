'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Filter,
  Search,
  RefreshCw,
  EyeOff,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function AuditorTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [assetId, setAssetId] = useState('');
  const [status, setStatus] = useState('');
  const [assets, setAssets] = useState<any[]>([]);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/admin/assets');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch (e) {}
  };

  const fetchMaskedTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      if (assetId) params.set('assetId', assetId);
      if (status) params.set('status', status);

      const res = await fetch(`/api/auditor/transactions?${params.toString()}`);
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    fetchMaskedTransactions();
  }, [page, assetId, status]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-semibold">
              MASKED REGULATORY VIEW
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              v_auditor_transactions
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Masked Transaction Explorer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero-PII compliance view. Customer identifiers are masked; only transaction quantities, asset types, and execution outcomes are accessible.
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
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span>Filters:</span>
        </div>

        <select
          value={assetId}
          onChange={(e) => {
            setAssetId(e.target.value);
            setPage(1);
          }}
          className="bg-slate-900 border border-[#182030] rounded-lg px-2.5 py-1.5 text-slate-300 focus:border-emerald-500"
        >
          <option value="">All Assets</option>
          {assets.map((a) => (
            <option key={a.asset_id} value={a.asset_id}>
              {a.symbol} ({a.name})
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="bg-slate-900 border border-[#182030] rounded-lg px-2.5 py-1.5 text-slate-300 focus:border-emerald-500"
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={fetchMaskedTransactions}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-[#182030] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 inline mr-2" />
            Querying PostgreSQL Masked View v_auditor_transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            No masked transactions found for selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c101a] border-b border-[#182030] text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tx ID</th>
                  <th className="py-3 px-4 font-semibold">Masked Sender</th>
                  <th className="py-3 px-4 font-semibold">Masked Receiver</th>
                  <th className="py-3 px-4 font-semibold">Asset</th>
                  <th className="py-3 px-4 font-semibold text-right">Quantity</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Outcome Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {transactions.map((tx) => (
                  <tr key={tx.transaction_id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      TXN-{tx.transaction_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <EyeOff className="w-3 h-3 text-slate-500" />
                        <span>{tx.sender_account_no}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <EyeOff className="w-3 h-3 text-slate-500" />
                        <span>{tx.receiver_account_no}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white">{tx.symbol}</span>{' '}
                      <span className="text-[10px] text-slate-500">({tx.asset_name})</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      {parseFloat(tx.quantity).toLocaleString(undefined, {
                        maximumFractionDigits: 8,
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase text-[10px]">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          tx.status === 'success'
                            ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-400'
                            : tx.status === 'pending'
                            ? 'bg-amber-950/70 border border-amber-800 text-amber-400'
                            : 'bg-rose-950/70 border border-rose-800 text-rose-400'
                        }`}
                      >
                        {tx.status === 'success' && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {tx.status === 'pending' && <Clock className="w-2.5 h-2.5" />}
                        {tx.status === 'failed' && <XCircle className="w-2.5 h-2.5" />}
                        {tx.status === 'rejected' && <AlertTriangle className="w-2.5 h-2.5" />}
                        {tx.status}
                      </span>
                      {tx.failure_reason && (
                        <div className="text-[9px] text-rose-400 mt-0.5 max-w-xs truncate">
                          {tx.failure_reason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-[#0c101a] border-t border-[#182030] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">
            Page {page} of {totalPages} ({total} masked transactions)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
