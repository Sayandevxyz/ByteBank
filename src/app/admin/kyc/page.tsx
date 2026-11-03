'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  XCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  FileText,
  AlertCircle,
  Hash,
  UserCheck,
} from 'lucide-react';

export default function AdminKycPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectModalCustomer, setRejectModalCustomer] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchKycList = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/api/admin/kyc' : `/api/admin/kyc?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.customers) setCustomers(data.customers);
    } catch (err: any) {
      setMessage({ text: 'Failed to fetch KYC records.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycList();
  }, [statusFilter]);

  const handleUpdateStatus = async (customerId: number, status: 'verified' | 'rejected', reason?: string) => {
    try {
      setProcessingId(customerId);
      setMessage(null);

      const res = await fetch('/api/admin/kyc', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          status,
          rejectionReason: reason || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error?.message || 'Failed to update KYC status.', type: 'error' });
        return;
      }

      setMessage({
        text: `Customer #${customerId} successfully updated to ${status.toUpperCase()}! (Audit trigger logged)`,
        type: 'success',
      });
      setRejectModalCustomer(null);
      setRejectionReason('');
      fetchKycList();
    } catch (err: any) {
      setMessage({ text: err.message || 'Error updating KYC.', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-400 font-semibold">
              COMPLIANCE QUEUE
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              Audit Triggers Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">KYC Verification Operations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review synthetic customer identification hashes, verify documentation, and approve account trading capabilities.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="text-xs font-mono text-blue-400 hover:text-blue-300"
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

      <div className="glass-panel p-4 rounded-2xl border border-[#182030] flex items-center justify-between">
        <div className="flex rounded-xl bg-slate-900 border border-[#182030] p-1">
          {(['pending', 'verified', 'rejected', 'all'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <button
          onClick={fetchKycList}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-[#182030] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-400 inline mr-2" />
            Querying PostgreSQL Customer Registry...
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono">
            No customers found matching filter &quot;{statusFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c101a] border-b border-[#182030] text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Cust ID</th>
                  <th className="py-3 px-4 font-semibold">Full Name</th>
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold">ID Proof (SHA-256)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Registered</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {customers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-blue-400 font-bold">
                      CUST{c.customer_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{c.full_name}</div>
                      <div className="text-[10px] text-slate-500">DOB: {c.dob}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-300">{c.email}</div>
                      <div className="text-[10px] text-slate-500">{c.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Hash className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-[#182030] truncate max-w-[140px]">
                          {c.id_proof_hash}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          c.kyc_status === 'verified'
                            ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-400'
                            : c.kyc_status === 'pending'
                            ? 'bg-amber-950/70 border border-amber-800 text-amber-400'
                            : 'bg-rose-950/70 border border-rose-800 text-rose-400'
                        }`}
                      >
                        {c.kyc_status === 'verified' && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {c.kyc_status === 'pending' && <ShieldAlert className="w-2.5 h-2.5" />}
                        {c.kyc_status === 'rejected' && <XCircle className="w-2.5 h-2.5" />}
                        {c.kyc_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {c.kyc_status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(c.customer_id, 'verified')}
                            disabled={processingId === c.customer_id}
                            className="px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 text-[10px] font-mono transition-colors inline-flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModalCustomer(c)}
                            disabled={processingId === c.customer_id}
                            className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 text-[10px] font-mono transition-colors inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[10px] font-mono">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rejectModalCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-rose-800/80 bg-slate-950 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Reject KYC for {rejectModalCustomer.full_name}</span>
            </div>

            <p className="text-xs text-slate-300">
              Provide a formal compliance rejection reason. This reason will be written to the database audit log and visible to the customer.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. ID proof hash unreadable or expired document."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-900 border border-[#182030] rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectModalCustomer(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(
                    rejectModalCustomer.customer_id,
                    'rejected',
                    rejectionReason || 'Document verification failed.'
                  )
                }
                disabled={processingId === rejectModalCustomer.customer_id}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono shadow-glow-blue"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
