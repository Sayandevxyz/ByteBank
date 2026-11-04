'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Wallet,
  ArrowRightLeft,
  RefreshCw,
  TrendingUp,
  Lock,
  History,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

const PortfolioOrbCanvas = dynamic(() => import('../../../components/canvas/PortfolioOrbCanvas'), {
  ssr: false,
  loading: () => <div className="h-80 w-full flex items-center justify-center text-slate-500 text-xs font-mono">Loading 3D Portfolio...</div>,
});

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    Promise.all([
      fetch('/api/customer/holdings').then((r) => r.json()),
      fetch('/api/customer/transactions?limit=6').then((r) => r.json()),
    ])
      .then(([holdingsData, txnData]) => {
        if (holdingsData?.error?.code === 'UNAUTHORIZED') {
          router.push('/login');
          return;
        }
        setData(holdingsData);
        if (txnData?.transactions) setRecentTxns(txnData.transactions);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();

    const sse = new EventSource('/api/realtime/sse');
    sse.addEventListener('TRANSACTION_UPDATE', () => fetchDashboard());
    sse.addEventListener('TRANSFER_RECEIVED', () => fetchDashboard());
    return () => sse.close();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-400 font-mono text-sm">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2" />
        Querying PostgreSQL Portfolio State...
      </div>
    );
  }

  const holdings = data?.holdings || [];
  const account = data?.account;
  const totalValuation = data?.totalPortfolioValue || 0;

  const cryptoHoldings = holdings.filter((h: any) => h.type === 'crypto');
  const stockHoldings = holdings.filter((h: any) => h.type === 'stock');

  const cryptoValuation = cryptoHoldings.reduce((sum: number, h: any) => sum + h.simulatedValueSru, 0);
  const stockValuation = stockHoldings.reduce((sum: number, h: any) => sum + h.simulatedValueSru, 0);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-[#182030]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#111c33] border border-blue-800 text-blue-400 font-bold">
              {account?.account_no || 'BB-ACC-XXXX'}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded border ${account?.status === 'active'
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-400'
                  : 'bg-rose-950/70 border-rose-800 text-rose-400'
                }`}
            >
              {account?.status?.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Portfolio Overview</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customer/transfer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-glow-blue transition-all"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Send Assets
          </Link>
          <Link
            href="/customer/swap"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-[#182030] hover:border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Swap (Simulated)
          </Link>
          <Link
            href="/customer/history"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-[#182030] hover:border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            Statement
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-[#182030]">
          <span className="text-xs font-medium text-slate-400">Net Portfolio Valuation</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalValuation.toLocaleString()} <span className="text-xs text-blue-400">SRU</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Simulated Reference Units</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a] border border-[#182030]">
          <span className="text-xs font-medium text-slate-400">Crypto Allocation</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {cryptoValuation.toLocaleString()} <span className="text-xs text-slate-400">SRU</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalValuation > 0 ? ((cryptoValuation / totalValuation) * 100).toFixed(1) : 0}% of portfolio
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a] border border-[#182030]">
          <span className="text-xs font-medium text-slate-400">Equities / Stocks</span>
          <div className="text-2xl font-bold font-mono text-violet-400 mt-1">
            {stockValuation.toLocaleString()} <span className="text-xs text-slate-400">SRU</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalValuation > 0 ? ((stockValuation / totalValuation) * 100).toFixed(1) : 0}% of portfolio
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a] border border-[#182030]">
          <span className="text-xs font-medium text-slate-400">Active Asset Holdings</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{holdings.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            <Link href="/customer/holdings" className="text-blue-400 hover:underline">
              Inspect multi-asset list →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">3D Holdings Visualization</h2>
            <span className="text-xs text-slate-500 font-mono">React Three Fiber · Interactive</span>
          </div>
          <PortfolioOrbCanvas holdings={holdings} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">Top Asset Positions</h2>
            <Link href="/customer/holdings" className="text-xs text-blue-400 hover:underline">
              View All ({holdings.length})
            </Link>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {holdings.slice(0, 5).map((h: any) => (
              <div
                key={h.symbol}
                className="p-3 rounded-xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">
                    {h.name} <span className="text-slate-400 font-mono">({h.symbol})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {h.availableQuantity} available {h.reservedQuantity > 0 && `(${h.reservedQuantity} reserved)`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white">{h.simulatedValueSru.toLocaleString()} SRU</div>
                  <div className="text-[10px] text-slate-500">@{h.simRefPrice} SRU/unit</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Account Activity</h2>
            <p className="text-xs text-slate-400">Real-time ledger events recorded in PostgreSQL</p>
          </div>
          <Link href="/customer/history" className="text-xs text-blue-400 hover:underline">
            Full Transaction History →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#182030] bg-slate-950/50">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0c101a] text-slate-400 border-b border-[#182030] uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Counterparty</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {recentTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                recentTxns.map((txn: any) => (
                  <tr key={txn.transaction_id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-400">#{txn.transaction_id}</td>
                    <td className="py-3 px-4 capitalize font-medium">{txn.type}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {txn.direction === 'DEBIT' ? (
                        <span className="flex items-center gap-1 text-slate-300">
                          <ArrowUpRight className="w-3 h-3 text-rose-400" /> To: {txn.receiver_account_no}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-300">
                          <ArrowDownLeft className="w-3 h-3 text-emerald-400" /> From: {txn.sender_account_no || 'EXTERNAL'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{txn.symbol}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={txn.direction === 'DEBIT' ? 'text-rose-400' : 'text-emerald-400'}>
                        {txn.direction === 'DEBIT' ? '-' : '+'}
                        {parseFloat(txn.quantity)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${txn.status === 'success'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : txn.status === 'failed'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{new Date(txn.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}