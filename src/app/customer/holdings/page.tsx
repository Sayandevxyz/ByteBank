'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightLeft, RefreshCw, Lock, ShieldCheck, Search } from 'lucide-react';

export default function CustomerHoldingsPage() {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [totalValuation, setTotalValuation] = useState(0);
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fetchHoldings = () => {
    fetch('/api/customer/holdings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.holdings) {
          setHoldings(data.holdings);
          setTotalValuation(data.totalPortfolioValue || 0);
          setAccount(data.account);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const filtered = holdings.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || h.type.toUpperCase() === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Asset Holdings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated Holding Table (<code>account_id</code>, <code>asset_id</code>, <code>quantity &gt;= 0</code>). Materialized projection of double-entry ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Total Portfolio Value</span>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {totalValuation.toLocaleString()} <span className="text-xs">SRU</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset or symbol..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'ALL' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Assets ({holdings.length})
          </button>
          <button
            onClick={() => setFilterType('CRYPTO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'CRYPTO' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => setFilterType('STOCK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'STOCK' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Stocks (Simulated)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-mono">
            <tr>
              <th className="py-3.5 px-4">Asset</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Total Balance</th>
              <th className="py-3.5 px-4">Available Qty</th>
              <th className="py-3.5 px-4">Reserved Qty</th>
              <th className="py-3.5 px-4">Reference Price (SRU)</th>
              <th className="py-3.5 px-4">Total Value</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                  Loading multi-asset balances from PostgreSQL...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                  No assets match current criteria.
                </td>
              </tr>
            ) : (
              filtered.map((h: any) => (
                <tr key={h.symbol} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{h.name}</div>
                    <div className="text-[11px] font-mono text-cyan-400">{h.symbol}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        h.type === 'crypto'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-violet-950 text-violet-300 border border-violet-800'
                      }`}
                    >
                      {h.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-white">
                    {h.totalQuantity} <span className="text-[10px] text-slate-500">{h.symbol}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                    {h.availableQuantity}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-400">
                    {h.reservedQuantity > 0 ? (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {h.reservedQuantity}
                      </span>
                    ) : (
                      '0.00'
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {h.simRefPrice.toLocaleString()} SRU
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {h.simulatedValueSru.toLocaleString()} <span className="text-cyan-400 text-[10px]">SRU</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/customer/transfer?assetId=${h.assetId}`}
                        className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-300 font-medium text-[11px] transition-colors"
                      >
                        Send
                      </Link>
                      <Link
                        href={`/customer/swap?fromAsset=${h.assetId}`}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-[11px] transition-colors"
                      >
                        Swap
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
