'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  Clock,
  ShieldCheck,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Layers,
} from 'lucide-react';

interface Reservation {
  reservation_id: number;
  asset_id: number;
  symbol: string;
  asset_name: string;
  quantity: string;
  status: 'active' | 'consumed' | 'expired' | 'cancelled';
  expires_at: string;
  created_at: string;
  is_live: boolean;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [releasingId, setReleasingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [selectedAssetId, setSelectedAssetId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resRes, holdingsRes] = await Promise.all([
        fetch('/api/customer/reservations').then((r) => r.json()),
        fetch('/api/customer/holdings').then((r) => r.json()),
      ]);

      if (resRes.reservations) {
        setReservations(resRes.reservations);
      }
      if (holdingsRes.holdings) {
        setHoldings(holdingsRes.holdings);
        if (holdingsRes.holdings.length > 0 && !selectedAssetId) {
          setSelectedAssetId(holdingsRes.holdings[0].asset_id);
        }
      }
    } catch (err: any) {
      setError('Failed to fetch reservations data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const sse = new EventSource('/api/realtime/sse');
    sse.addEventListener('TRANSACTION_UPDATE', () => fetchData());
    return () => sse.close();
  }, []);

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const qty = parseFloat(quantity);
    if (!selectedAssetId || !qty || qty <= 0) {
      setError('Please select an asset and valid quantity.');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/customer/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: Number(selectedAssetId),
          quantity: qty,
          durationSeconds: durationMinutes * 60,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || 'Failed to place reservation.');
        return;
      }

      setSuccessMsg(`Reservation #${data.reservationId} successfully placed! Available quantity reduced.`);
      setQuantity('');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Error creating reservation.');
    } finally {
      setCreating(false);
    }
  };

  const handleReleaseReservation = async (resId: number) => {
    setError(null);
    setSuccessMsg(null);

    try {
      setReleasingId(resId);
      const res = await fetch(`/api/customer/reservations?id=${resId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || 'Failed to release reservation.');
        return;
      }

      setSuccessMsg(`Reservation #${resId} released back to available balance.`);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Error releasing reservation.');
    } finally {
      setReleasingId(null);
    }
  };

  const selectedHolding = holdings.find((h) => h.asset_id === Number(selectedAssetId));

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#111c33] border border-blue-800 text-blue-400 font-semibold">
              TWO-PHASE CONCURRENCY CONTROL
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              reserve_asset() &bull; release_reservation()
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Asset Reservations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Isolate and hold asset amounts for in-flight authorizations and staged settlements without double-spending.
          </p>
        </div>

        <Link
          href="/customer/dashboard"
          className="text-xs font-mono text-blue-400 hover:text-blue-300"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-2xl border border-[#182030] overflow-hidden">
            <div className="p-4 bg-[#0c101a] border-b border-[#182030] flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Active & Historical Reservations
              </h2>
              <button
                onClick={fetchData}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-500 text-xs font-mono">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400 inline mr-2" />
                Querying PostgreSQL Reservation State...
              </div>
            ) : reservations.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs font-mono">
                No active or historical reservations on this account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0c101a] border-b border-[#182030] text-slate-400">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Res ID</th>
                      <th className="py-3 px-4 font-semibold">Asset</th>
                      <th className="py-3 px-4 font-semibold text-right">Reserved Amount</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Expires At</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {reservations.map((res) => {
                      const isExpired = new Date(res.expires_at) < new Date();
                      return (
                        <tr key={res.reservation_id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-4 text-blue-400 font-bold">
                            RES-{res.reservation_id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-white">{res.symbol}</span>{' '}
                            <span className="text-[10px] text-slate-500">({res.asset_name})</span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-amber-400">
                            {parseFloat(res.quantity).toLocaleString(undefined, {
                              maximumFractionDigits: 8,
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                                res.status === 'active' && !isExpired
                                  ? 'bg-amber-950/70 border border-amber-800 text-amber-400'
                                  : res.status === 'consumed'
                                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {res.status === 'active' && !isExpired && (
                                <Lock className="w-2.5 h-2.5" />
                              )}
                              {res.status === 'consumed' && (
                                <CheckCircle2 className="w-2.5 h-2.5" />
                              )}
                              {res.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {new Date(res.expires_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                            <div className="text-[9px] text-slate-500">
                              {new Date(res.expires_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {res.status === 'active' && !isExpired ? (
                              <button
                                onClick={() => handleReleaseReservation(res.reservation_id)}
                                disabled={releasingId === res.reservation_id}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 text-[10px] font-mono transition-colors inline-flex items-center gap-1"
                              >
                                {releasingId === res.reservation_id ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Unlock className="w-3 h-3" />
                                )}
                                Release
                              </button>
                            ) : (
                              <span className="text-slate-600 text-[10px]">&mdash;</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <form
            onSubmit={handleCreateReservation}
            className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-5"
          >
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <PlusCircle className="w-4 h-4 text-blue-400" />
              <span>Create Staged Reservation</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">Select Asset</label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-[#182030] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              >
                {holdings.map((h) => (
                  <option key={h.asset_id} value={h.asset_id}>
                    {h.symbol} - Avail: {h.available_qty.toFixed(4)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <label>Reserve Quantity</label>
                {selectedHolding && (
                  <span className="text-blue-400 text-[11px]">
                    Max: {selectedHolding.available_qty.toFixed(4)}
                  </span>
                )}
              </div>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-900 border border-[#182030] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">Duration (Lock Window)</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 15, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-1.5 rounded-lg text-xs font-mono transition-all ${
                      durationMinutes === mins
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-900 border border-[#182030] text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={creating || !quantity || parseFloat(quantity) <= 0}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-xs transition-all shadow-glow-blue flex items-center justify-center gap-1.5"
            >
              {creating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Reserving in DB...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Lock Reservation
                </>
              )}
            </button>
          </form>

          <div className="p-5 rounded-2xl glass-panel border border-[#182030] space-y-3 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Reservation Invariant Formula</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-blue-300 border border-[#182030]">
              available_qty = total_holding - &sum;(active_reservations)
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              When an asset reservation is placed:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[10px]">
              <li>The holding table balance remains unchanged.</li>
              <li>The <code className="text-blue-300">v_available_quantity</code> view instantly drops.</li>
              <li>Concurrent transfers are prohibited from spending the reserved portion.</li>
              <li>Consuming the reservation decrements the holding atomically.</li>
              <li>Cancelling or expiring unlocks the balance without transaction history deletion.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
