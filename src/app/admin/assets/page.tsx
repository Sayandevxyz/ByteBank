'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sliders,
  TrendingUp,
  PlusCircle,
  RefreshCw,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Coins,
  DollarSign,
  Radio,
} from 'lucide-react';

interface Asset {
  asset_id: number;
  symbol: string;
  name: string;
  type: 'crypto' | 'stock';
  quantity_scale: number;
  sim_ref_price: string;
  price_updated_at: string;
}

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPriceAsset, setEditingPriceAsset] = useState<Asset | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    name: '',
    type: 'crypto' as 'crypto' | 'stock',
    quantityScale: 8,
    simRefPrice: '',
  });
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/assets');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch (err: any) {
      setMessage({ text: 'Failed to load assets.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();

    const sse = new EventSource('/api/realtime/sse');
    sse.addEventListener('PRICE_UPDATE', () => fetchAssets());
    return () => sse.close();
  }, []);

  const handleUpdatePrice = async () => {
    if (!editingPriceAsset) return;
    const priceVal = parseFloat(newPrice);
    if (!priceVal || priceVal <= 0) {
      setMessage({ text: 'Please enter a positive simulated price.', type: 'error' });
      return;
    }

    try {
      setProcessing(true);
      setMessage(null);

      const res = await fetch('/api/admin/prices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: editingPriceAsset.asset_id,
          simRefPrice: priceVal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error?.message || 'Failed to update price.', type: 'error' });
        return;
      }

      setMessage({
        text: `Price for ${editingPriceAsset.symbol} updated to $${priceVal.toLocaleString()}! Broadcasted live via SSE.`,
        type: 'success',
      });
      setEditingPriceAsset(null);
      setNewPrice('');
      fetchAssets();
    } catch (err: any) {
      setMessage({ text: err.message || 'Error updating price.', type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.symbol || !newAsset.name || !newAsset.simRefPrice) {
      setMessage({ text: 'Please complete all required fields.', type: 'error' });
      return;
    }

    try {
      setProcessing(true);
      setMessage(null);

      const res = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: newAsset.symbol.toUpperCase().trim(),
          name: newAsset.name.trim(),
          type: newAsset.type,
          quantityScale: Number(newAsset.quantityScale),
          simRefPrice: parseFloat(newAsset.simRefPrice),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error?.message || 'Failed to create asset.', type: 'error' });
        return;
      }

      setMessage({
        text: `Asset ${newAsset.symbol.toUpperCase()} added to PostgreSQL registry!`,
        type: 'success',
      });
      setShowAddModal(false);
      setNewAsset({ symbol: '', name: '', type: 'crypto', quantityScale: 8, simRefPrice: '' });
      fetchAssets();
    } catch (err: any) {
      setMessage({ text: err.message || 'Error creating asset.', type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-semibold">
              SIMULATED ORACLE &amp; ASSETS
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              Live SSE Broadcast
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Asset &amp; Price Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage asset definitions, configure scale precision rules, and adjust simulated reference exchange rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-glow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Asset
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
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 inline mr-2" />
            Querying PostgreSQL Asset Catalog...
          </div>
        ) : (
          assets.map((asset) => (
            <div
              key={asset.asset_id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white font-mono">{asset.symbol}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                        asset.type === 'crypto'
                          ? 'bg-cyan-950/80 border border-cyan-800 text-cyan-400'
                          : 'bg-purple-950/80 border border-purple-800 text-purple-400'
                      }`}
                    >
                      {asset.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{asset.name}</div>
                </div>

                <button
                  onClick={() => {
                    setEditingPriceAsset(asset);
                    setNewPrice(parseFloat(asset.sim_ref_price).toString());
                  }}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-600 text-slate-400 hover:text-emerald-400 transition-colors"
                  title="Update Simulated Price"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500">Simulated Price:</span>
                  <span className="text-lg font-extrabold text-white">
                    ${parseFloat(asset.sim_ref_price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span className="text-slate-500">Scale Precision:</span>
                  <span className="text-cyan-400 font-bold">{asset.quantity_scale} decimals</span>
                </div>

                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>Last Price Tick:</span>
                  <span>{new Date(asset.price_updated_at).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editingPriceAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-emerald-800/80 bg-slate-950 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Update Simulated Rate for {editingPriceAsset.symbol}</span>
            </div>

            <p className="text-xs text-slate-300">
              Entering a new reference rate will update PostgreSQL <code className="text-emerald-300">asset.sim_ref_price</code> and broadcast a price tick to all connected clients over Server-Sent Events.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">
                New Simulated Reference Price (SRU / USD equivalent):
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="number"
                  step="any"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingPriceAsset(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdatePrice}
                disabled={processing || !newPrice || parseFloat(newPrice) <= 0}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono shadow-glow"
              >
                {processing ? 'Broadcasting...' : 'Broadcast Price Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAsset}
            className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950 max-w-md w-full space-y-4"
          >
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Register New Simulated Asset</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Asset Symbol (e.g. AVAX, NVDA)</label>
                <input
                  type="text"
                  required
                  placeholder="AVAX"
                  value={newAsset.symbol}
                  onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Asset Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Avalanche"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Asset Class</label>
                  <select
                    value={newAsset.type}
                    onChange={(e: any) => setNewAsset({ ...newAsset, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  >
                    <option value="crypto">Crypto</option>
                    <option value="stock">Simulated Stock</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Quantity Decimals</label>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={newAsset.quantityScale}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, quantityScale: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Initial Reference Price ($)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="35.50"
                  value={newAsset.simRefPrice}
                  onChange={(e) => setNewAsset({ ...newAsset, simRefPrice: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono shadow-glow"
              >
                {processing ? 'Registering...' : 'Register in PostgreSQL'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
