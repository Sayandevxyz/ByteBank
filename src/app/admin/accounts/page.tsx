'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Lock,
  Unlock,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Coins,
} from 'lucide-react';

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'frozen'>('all');
  const [actionModal, setActionModal] = useState<{
    account: any;
    action: 'freeze' | 'unfreeze';
  } | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/accounts');
      const data = await res.json();
      if (data.accounts) setAccounts(data.accounts);
    } catch (err: any) {
      setMessage({ text: 'Failed to load accounts list.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleExecuteAction = async () => {
    if (!actionModal) return;
    if (!actionReason.trim()) {
      setMessage({ text: 'A formal compliance reason is required.', type: 'error' });
      return;
    }

    try {
      setProcessing(true);
      setMessage(null);

      const res = await fetch('/api/admin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: actionModal.account.account_id,
          action: actionModal.action,
          reason: actionReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error?.message || 'Failed to update account.', type: 'error' });
        return;
      }

      setMessage({
        text: `Account ${actionModal.account.account_no} was successfully ${actionModal.action}d. Audit log recorded.`,
        type: 'success',
      });
      setActionModal(null);
      setActionReason('');
      fetchAccounts();
    } catch (err: any) {
      setMessage({ text: err.message || 'Error updating account status.', type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.account_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || acc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-400 font-semibold">
              ACCOUNTS REGISTRY
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              Trigger-Guarded Status Updates
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Account Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enforce compliance freezes, review holdings distribution, and audit account status history.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          &larr; Back to Admin Dashboard
        </Link>
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

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by account number, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            {(['all', 'active', 'frozen'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white font-bold shadow-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAccounts}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-400 inline mr-2" />
            Reading Account Registry from PostgreSQL...
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            No accounts found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Account No</th>
                  <th className="py-3 px-4 font-semibold">Owner / Customer</th>
                  <th className="py-3 px-4 font-semibold">Account Type</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Simulated Valuation</th>
                  <th className="py-3 px-4 font-semibold">Holdings Count</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.account_id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-cyan-400 font-bold">
                      {acc.account_no}
                      {acc.is_system && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 text-[9px]">
                          SYSTEM
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">
                        {acc.customer_name || 'System Entity'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {acc.customer_email || 'treasury@bytebank.sim'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase text-[10px]">
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          acc.status === 'active'
                            ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-400'
                            : 'bg-rose-950/70 border border-rose-800 text-rose-400'
                        }`}
                      >
                        {acc.status === 'active' ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <Lock className="w-2.5 h-2.5" />
                        )}
                        {acc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      ${parseFloat(acc.total_portfolio_value_sru || '0').toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {acc.holdings_count || 0} distinct assets
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!acc.is_system && (
                        acc.status === 'active' ? (
                          <button
                            onClick={() => setActionModal({ account: acc, action: 'freeze' })}
                            className="px-2.5 py-1 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[10px] font-mono transition-colors inline-flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" /> Freeze
                          </button>
                        ) : (
                          <button
                            onClick={() => setActionModal({ account: acc, action: 'unfreeze' })}
                            className="px-2.5 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[10px] font-mono transition-colors inline-flex items-center gap-1"
                          >
                            <Unlock className="w-3 h-3" /> Unfreeze
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {actionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldAlert
                className={`w-4 h-4 ${
                  actionModal.action === 'freeze' ? 'text-rose-400' : 'text-emerald-400'
                }`}
              />
              <span className="capitalize">
                {actionModal.action} Account ({actionModal.account.account_no})
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {actionModal.action === 'freeze'
                ? 'Freezing this account blocks all outbound transfers and swaps immediately. The risk screening engine will reject transactions targeting this account.'
                : 'Unfreezing will restore transfer and swap permissions for this customer.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">
                Compliance Reason (Logged in audit_log):
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Account security review / Suspicious activity report #104"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActionModal(null);
                  setActionReason('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={processing || !actionReason.trim()}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold font-mono shadow-glow ${
                  actionModal.action === 'freeze'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {processing ? 'Applying...' : `Confirm ${actionModal.action.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
