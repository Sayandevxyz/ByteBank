'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  ArrowRightLeft,
  ArrowDown,
  ShieldCheck,
  Building,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AssetHolding {
  asset_id: number;
  symbol: string;
  name: string;
  type: 'crypto' | 'stock';
  quantity_scale: number;
  sim_ref_price: string;
  quantity: number;
  available_qty: number;
  reserved_qty: number;
}

export default function SwapPage() {
  const [holdings, setHoldings] = useState<AssetHolding[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [fromAssetId, setFromAssetId] = useState<number | ''>('');
  const [toAssetId, setToAssetId] = useState<number | ''>('');
  const [fromQuantity, setFromQuantity] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [swapResult, setSwapResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [holdingsRes, assetsRes] = await Promise.all([
        fetch('/api/customer/holdings').then((r) => r.json()),
        fetch('/api/admin/assets').then((r) => r.json()).catch(() => ({ assets: [] })),
      ]);

      if (holdingsRes.holdings) {
        setHoldings(holdingsRes.holdings);
        if (holdingsRes.holdings.length > 0) {
          setFromAssetId(holdingsRes.holdings[0].asset_id);
        }
      }

      if (assetsRes.assets && assetsRes.assets.length > 0) {
        setAllAssets(assetsRes.assets);

        const other = assetsRes.assets.find((a: any) => a.asset_id !== holdingsRes?.holdings?.[0]?.asset_id);
        if (other) setToAssetId(other.asset_id);
      } else if (holdingsRes.holdings && holdingsRes.holdings.length > 1) {
        setAllAssets(holdingsRes.holdings);
        setToAssetId(holdingsRes.holdings[1].asset_id);
      }
    } catch (err: any) {
      setError('Failed to load assets and holdings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const sse = new EventSource('/api/realtime/sse');
    sse.addEventListener('PRICE_UPDATE', () => fetchData());
    sse.addEventListener('TRANSACTION_UPDATE', () => fetchData());
    return () => sse.close();
  }, []);

  const selectedFromHolding = holdings.find((h) => h.asset_id === Number(fromAssetId));
  const selectedToAsset = allAssets.find((a) => a.asset_id === Number(toAssetId));

  const handlePercentage = (pct: number) => {
    if (!selectedFromHolding) return;
    const max = selectedFromHolding.available_qty || 0;
    const val = (max * pct).toFixed(Math.min(selectedFromHolding.quantity_scale, 8));
    setFromQuantity(val);
    setPreviewData(null);
    setSwapResult(null);
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSwapResult(null);

    const qty = parseFloat(fromQuantity);
    if (!qty || qty <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (fromAssetId === toAssetId) {
      setError('Target asset must be different from source asset.');
      return;
    }

    try {
      setPreviewLoading(true);
      const res = await fetch('/api/customer/swap/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAssetId: Number(fromAssetId),
          toAssetId: Number(toAssetId),
          fromQuantity: qty,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || 'Failed to calculate swap preview.');
        return;
      }

      setPreviewData(data);
    } catch (err: any) {
      setError(err.message || 'Network error previewing swap.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleConfirmSwap = async () => {
    if (!fromAssetId || !toAssetId || !fromQuantity) return;
    setError(null);

    try {
      setConfirmLoading(true);
      const res = await fetch('/api/customer/swap/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAssetId: Number(fromAssetId),
          toAssetId: Number(toAssetId),
          fromQuantity: parseFloat(fromQuantity),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || 'Failed to execute swap transaction.');
        return;
      }

      setSwapResult(data);
      setPreviewData(null);
      setFromQuantity('');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Network error confirming swap.');
    } finally {
      setConfirmLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-400 font-mono text-sm">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2" />
        Loading Market Maker asset pools...
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#111c33] border border-blue-800 text-blue-400 font-semibold">
              ATOMIC SWAP ENGINE
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              PostgreSQL ACID
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Simulated Asset Swap</h1>
          <p className="text-xs text-slate-400 mt-1">
            Swap digital assets and simulated equities instantly against the ByteBank Market Maker treasury at stored reference rates.
          </p>
        </div>

        <Link
          href="/customer/dashboard"
          className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <form onSubmit={handlePreview} className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>You Pay (Debit Source)</span>
                {selectedFromHolding && (
                  <span>
                    Available:{' '}
                    <button
                      type="button"
                      onClick={() => handlePercentage(1.0)}
                      className="text-blue-400 hover:underline font-bold"
                    >
                      {selectedFromHolding.available_qty.toFixed(Math.min(selectedFromHolding.quantity_scale, 6))}{' '}
                      {selectedFromHolding.symbol}
                    </button>
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#0c101a] border border-[#182030] space-y-3">
                <div className="flex items-center gap-3">
                  <select
                    value={fromAssetId}
                    onChange={(e) => {
                      setFromAssetId(Number(e.target.value));
                      setPreviewData(null);
                      setSwapResult(null);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                  >
                    {holdings.map((h) => (
                      <option key={h.asset_id} value={h.asset_id}>
                        {h.symbol} - {h.name} ({h.type})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={fromQuantity}
                    onChange={(e) => {
                      setFromQuantity(e.target.value);
                      setPreviewData(null);
                      setSwapResult(null);
                    }}
                    className="flex-1 bg-transparent text-right font-mono text-xl text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#182030]">
                  {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentage(pct)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] font-mono transition-colors"
                    >
                      {pct * 100}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-10">
              <button
                type="button"
                onClick={() => {
                  const oldFrom = fromAssetId;
                  setFromAssetId(toAssetId);
                  setToAssetId(oldFrom);
                  setPreviewData(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:border-blue-500 text-blue-400 flex items-center justify-center shadow-lg transition-transform hover:rotate-180"
                title="Invert swap pair"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>You Receive (Credit Target)</span>
                {selectedToAsset && (
                  <span>
                    Simulated Ref: ${parseFloat(selectedToAsset.sim_ref_price).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#0c101a] border border-[#182030] flex items-center gap-3">
                <select
                  value={toAssetId}
                  onChange={(e) => {
                    setToAssetId(Number(e.target.value));
                    setPreviewData(null);
                    setSwapResult(null);
                  }}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                >
                  {allAssets.map((a) => (
                    <option key={a.asset_id} value={a.asset_id} disabled={a.asset_id === fromAssetId}>
                      {a.symbol} - {a.name} ({a.type})
                    </option>
                  ))}
                </select>

                <div className="flex-1 text-right font-mono text-xl text-emerald-400 font-semibold">
                  {previewData
                    ? previewData.calculatedToQuantity.toLocaleString(undefined, {
                        maximumFractionDigits: selectedToAsset?.quantity_scale || 6,
                      })
                    : '---'}
                </div>
              </div>
            </div>

            {!previewData && (
              <button
                type="submit"
                disabled={previewLoading || !fromQuantity || parseFloat(fromQuantity) <= 0}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-sm transition-all shadow-glow-blue flex items-center justify-center gap-2"
              >
                {previewLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Querying Simulated Reference Rates...
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4" />
                    Preview Swap Quote
                  </>
                )}
              </button>
            )}
          </form>

          {previewData && (
            <div className="glass-panel p-6 rounded-2xl border border-blue-800/80 bg-[#111c33]/20 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-blue-800/40">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  ACID Stored Procedure Execution Quote
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700 text-blue-300">
                  simulated_swap()
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">From Rate:</span>
                  <span>
                    1 {previewData.fromAsset.symbol} = ${previewData.fromAsset.sim_ref_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">To Rate:</span>
                  <span>
                    1 {previewData.toAsset.symbol} = ${previewData.toAsset.sim_ref_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Effective Exchange Rate:</span>
                  <span className="text-white font-semibold">
                    1 {previewData.fromAsset.symbol} = {previewData.effectiveRate.toFixed(6)}{' '}
                    {previewData.toAsset.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Counterparty:</span>
                  <span className="text-blue-400">ByteBank Market Maker (BB-TREASURY)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Atomic Execution:</span>
                  <span className="text-emerald-400">2 Paired Transactions + 4 Paired Ledger Entries</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewData(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSwap}
                  disabled={confirmLoading}
                  className="flex-2 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs transition-all shadow-glow-blue flex items-center justify-center gap-2"
                >
                  {confirmLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Executing Atomic Swap in DB...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Execute Swap Now
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {swapResult && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-800/80 bg-emerald-950/20 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Atomic Swap Committed Successfully!
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Swap Group ID: <span className="text-blue-400 font-bold">{swapResult.swapGroup}</span>
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  PostgreSQL Committed Legs:
                </div>
                {swapResult.legs?.map((leg: any, idx: number) => (
                  <div
                    key={leg.transaction_id || idx}
                    className="p-3 rounded-lg bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="text-slate-500">#{leg.transaction_id} </span>
                      <span className="text-white font-medium">{leg.type.toUpperCase()}: </span>
                      <span className="text-slate-400">
                        {leg.sender_account_no} &rarr; {leg.receiver_account_no}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={idx === 0 ? 'text-rose-400' : 'text-emerald-400 font-bold'}>
                        {idx === 0 ? '-' : '+'}
                        {parseFloat(leg.quantity).toLocaleString()} {leg.symbol}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSwapResult(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono"
                >
                  Start New Swap
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-[#182030] space-y-4 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Building className="w-4 h-4" />
              <span>How Simulated Swaps Work</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              ByteBank rejects unbacked balance creation. Every swap executes as two strictly paired transactions against the system <strong>Market Maker Treasury</strong>:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 font-mono text-[11px]">
              <li>
                <strong className="text-blue-400">Leg 1 (Sell):</strong> Customer debited for source asset; Treasury credited.
              </li>
              <li>
                <strong className="text-emerald-400">Leg 2 (Buy):</strong> Treasury debited for target asset; Customer credited.
              </li>
              <li>
                <strong className="text-purple-400">Ledger Invariant:</strong> 4 immutable ledger entries inserted simultaneously.
              </li>
              <li>
                <strong className="text-amber-400">ACID Guarantee:</strong> If the Treasury has insufficient target balance, the entire swap rolls back.
              </li>
            </ol>

            <div className="pt-3 border-t border-[#182030]">
              <span className="text-slate-500 font-mono text-[10px] block">PL/pgSQL PROCEDURE:</span>
              <code className="text-[11px] text-blue-300 block mt-1 bg-slate-900 p-2 rounded border border-[#182030] font-mono">
                simulated_swap(acc_id, from_id, to_id, qty)
              </code>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/80 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Info className="w-4 h-4 shrink-0" />
              <span>Simulation Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-300/70">
              All prices, swaps, and token balances are simulated representations within a relational DBMS testing environment. No real funds or fiat currency are handled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
