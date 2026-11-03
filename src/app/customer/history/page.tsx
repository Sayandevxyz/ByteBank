'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  Filter,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export default function CustomerHistoryPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'statement'>('transactions');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [statement, setStatement] = useState<any[]>([]);
  const [accountNo, setAccountNo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [assetId, setAssetId] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [assets, setAssets] = useState<any[]>([]);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/admin/assets');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch (e) {}
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '15');
      if (assetId) params.set('assetId', assetId);
      if (type) params.set('type', type);
      if (status) params.set('status', status);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(`/api/customer/transactions?${params.toString()}`);
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

  const fetchStatement = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(`/api/customer/statement?${params.toString()}`);
      const data = await res.json();
      if (data.entries) {
        setStatement(data.entries);
        setAccountNo(data.accountNo || '');
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
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else {
      fetchStatement();
    }
  }, [page, activeTab, assetId, type, status, startDate, endDate]);

  useEffect(() => {
    const sse = new EventSource('/api/realtime/sse');
    sse.addEventListener('TRANSACTION_UPDATE', () => {
      if (activeTab === 'transactions') fetchTransactions();
      else fetchStatement();
    });
    return () => sse.close();
  }, [activeTab]);

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (assetId) params.set('assetId', assetId);
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    params.set('format', 'csv');
    window.open(`/api/customer/transactions?${params.toString()}`, '_blank');
  };

  const resetFilters = () => {
    setAssetId('');
    setType('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-semibold">
              TRANSACTION LEDGER
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              Double-entry Invariant Verified
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Activity & Statements</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse all historical transfers, simulated swaps, and signed double-entry ledger records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => {
                setActiveTab('transactions');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'transactions'
                  ? 'bg-cyan-600 text-white font-bold shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => {
                setActiveTab('statement');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'statement'
                  ? 'bg-cyan-600 text-white font-bold shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit Statement
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filters:</span>
        </div>

        {activeTab === 'transactions' && (
          <>
            <select
              value={assetId}
              onChange={(e) => {
                setAssetId(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono focus:border-cyan-500"
            >
              <option value="">All Assets</option>
              {assets.map((a) => (
                <option key={a.asset_id} value={a.asset_id}>
                  {a.symbol} ({a.name})
                </option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono focus:border-cyan-500"
            >
              <option value="">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="allocation">Allocation</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono focus:border-cyan-500"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="rejected">Rejected</option>
            </select>
          </>
        )}

        <div className="flex items-center gap-2">
          <span className="text-slate-500">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 font-mono text-[11px]"
          />
          <span className="text-slate-500">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 font-mono text-[11px]"
          />
        </div>

        {(assetId || type || status || startDate || endDate) && (
          <button
            onClick={resetFilters}
            className="text-[11px] text-cyan-400 hover:underline ml-auto font-mono"
          >
            Clear Filters
          </button>
        )}
      </div>

      {activeTab === 'transactions' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="py-20 flex items-center justify-center text-slate-500 text-xs font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 mr-2" />
              Fetching Transactions from PostgreSQL...
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs font-mono">
              No transactions match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Tx ID</th>
                    <th className="py-3 px-4 font-semibold">Direction / Counterparty</th>
                    <th className="py-3 px-4 font-semibold">Asset</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {transactions.map((tx) => {
                    const isDebit = tx.direction === 'OUT';
                    return (
                      <tr key={tx.transaction_id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 text-cyan-400 font-bold">
                          #{tx.transaction_id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {isDebit ? (
                              <div className="w-6 h-6 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div>
                              <div className="text-white font-medium">
                                {isDebit ? 'To: ' : 'From: '}
                                {tx.counterparty_account_no}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {tx.counterparty_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white">{tx.symbol}</span>{' '}
                          <span className="text-[10px] text-slate-500">({tx.asset_name})</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-semibold ${
                              isDebit ? 'text-rose-400' : 'text-emerald-400 font-bold'
                            }`}
                          >
                            {isDebit ? '-' : '+'}
                            {parseFloat(tx.quantity).toLocaleString(undefined, {
                              maximumFractionDigits: 8,
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase text-[10px]">
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
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
                            {tx.status.toUpperCase()}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">
              Showing page {page} of {totalPages} ({total} total transactions)
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
      )}

      {activeTab === 'statement' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Immutable Account Ledger Statement ({accountNo})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every line below is an immutable <code className="text-cyan-300">ledger_entry</code> generated by a committed transaction. Updates and deletes are blocked by database triggers.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded bg-emerald-950/60 border border-emerald-800">
              Holding = &sum; Ledger Entries
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 inline mr-2" />
              Evaluating Statement View...
            </div>
          ) : statement.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs font-mono">
              No statement entries found for this account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Ledger Entry ID</th>
                    <th className="py-3 px-4 font-semibold">Linked Tx ID</th>
                    <th className="py-3 px-4 font-semibold">Asset</th>
                    <th className="py-3 px-4 font-semibold text-right">Signed Delta</th>
                    <th className="py-3 px-4 font-semibold">Counterparty</th>
                    <th className="py-3 px-4 font-semibold">Posted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {statement.map((entry) => {
                    const signedQty = parseFloat(entry.signed_quantity);
                    const isPositive = signedQty > 0;
                    return (
                      <tr key={entry.entry_id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-cyan-400 font-bold">
                          ENTRY-{entry.entry_id}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          TX-{entry.transaction_id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white">{entry.symbol}</span>{' '}
                          <span className="text-[10px] text-slate-500">({entry.asset_name})</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-semibold ${
                              isPositive ? 'text-emerald-400 font-bold' : 'text-rose-400'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {signedQty.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {entry.counterparty_account_no || 'SYSTEM'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {new Date(entry.posted_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
