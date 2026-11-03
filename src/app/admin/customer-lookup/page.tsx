'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldAlert,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  History,
  AlertTriangle,
  Lock,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

const PURPOSE_OPTIONS = [
  { code: 'KYC_VERIFICATION', label: 'KYC Verification (Document Authenticity Check)' },
  { code: 'FRAUD_INVESTIGATION', label: 'Fraud & Anti-Money Laundering (AML) Investigation' },
  { code: 'CUSTOMER_SUPPORT_INQUIRY', label: 'Customer Support Request (Ticketed Query)' },
  { code: 'COURT_ORDER_LEGAL', label: 'Legal Subpoena / Regulatory Court Order' },
  { code: 'AUDIT_COMPLIANCE_REVIEW', label: 'Periodic Internal Compliance Review' },
];

export default function CustomerLookupPage() {
  const [queryInput, setQueryInput] = useState('');
  const [purposeCode, setPurposeCode] = useState(PURPOSE_OPTIONS[0].code);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [accessLogged, setAccessLogged] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) {
      setError('Please provide a Customer ID, Account Number, or Email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setAccessLogged(null);

      let payload: any = { purposeCode };
      const trimmed = queryInput.trim();
      if (trimmed.startsWith('BB-ACC-') || trimmed.startsWith('ACC-')) {
        payload.accountNo = trimmed;
      } else if (trimmed.includes('@')) {
        payload.email = trimmed;
      } else {
        const num = parseInt(trimmed.replace(/\D/g, ''), 10);
        if (!isNaN(num)) payload.customerId = num;
        else payload.email = trimmed;
      }

      const res = await fetch('/api/admin/customer-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || 'Customer lookup failed.');
        return;
      }

      setResult(data);
      setAccessLogged({
        purposeCode,
        timestamp: new Date().toLocaleTimeString(),
        staffRole: 'ADMIN',
      });
    } catch (err: any) {
      setError(err.message || 'Network error during customer lookup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-400 font-semibold">
              CONTROLLED STAFF ACCESS PATH
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              Mandatory access_log Auditing
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Customer Profile &amp; KYC Lookup</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access customer PII and portfolio history through a controlled, purpose-coded database API path.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200/90 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300">Privacy &amp; Compliance Requirement:</div>
            <p className="text-[11px] leading-relaxed text-amber-200/70">
              By submitting this query, your staff session credentials and specified purpose code will be immutably recorded into the PostgreSQL <code className="text-amber-300 font-mono">access_log</code> table for independent audit by regulatory compliance officers.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">
                Customer Identifier (Customer ID, Account No, or Email)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. CUST101, BB-ACC-5001, or rahul.sharma@example.com"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">Mandatory Access Purpose Code</label>
              <select
                value={purposeCode}
                onChange={(e) => setPurposeCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              >
                {PURPOSE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] font-mono text-slate-500">
              Try seeded master accounts: <span className="text-cyan-400">CUST101</span>, <span className="text-cyan-400">CUST104</span>, or <span className="text-cyan-400">BB-ACC-5004</span>
            </div>

            <button
              type="submit"
              disabled={loading || !queryInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white font-semibold text-xs font-mono shadow-glow transition-all flex items-center gap-2"
            >
              {loading ? 'Logging & Querying...' : 'Execute Logged Lookup'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {accessLogged && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>
              Access verified and committed to PostgreSQL <code className="text-white font-bold">access_log</code> at {accessLogged.timestamp} with purpose: <code className="text-cyan-200">{accessLogged.purposeCode}</code>.
            </span>
          </div>
          <Link
            href="/auditor/access-logs"
            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
          >
            Verify in Auditor Log &rarr;
          </Link>
        </div>
      )}

      {result && result.customer && (
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400 flex items-center justify-center font-mono font-bold text-lg">
                  {result.customer.full_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{result.customer.full_name}</h2>
                  <div className="text-xs font-mono text-cyan-400">
                    ID: CUST{result.customer.customer_id}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{result.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{result.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>DOB: {result.customer.dob}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="text-slate-400 text-[11px]">{result.customer.address}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Account &amp; Compliance Status
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Account No:</span>
                  <span className="text-white font-bold">{result.account?.account_no}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Account Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      result.account?.status === 'active'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {result.account?.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">KYC Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      result.customer?.kyc_status === 'verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {result.customer?.kyc_status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-slate-500 text-[10px]">ID Proof Hash (SHA-256):</div>
                  <div className="p-2 mt-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 break-all">
                    {result.customer?.id_proof_hash}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Portfolio Valuation
                </h3>
                <div className="text-2xl font-extrabold text-white font-mono mt-3">
                  ${result.holdings?.reduce((acc: number, h: any) => acc + (parseFloat(h.quantity) * parseFloat(h.sim_ref_price)), 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Simulated Reference Valuation
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
                Holdings across {result.holdings?.length || 0} distinct digital asset categories.
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 text-xs font-bold font-mono text-white">
              Customer Asset Holdings
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Symbol</th>
                    <th className="py-2.5 px-4">Asset Name</th>
                    <th className="py-2.5 px-4">Asset Class</th>
                    <th className="py-2.5 px-4 text-right">Total Quantity</th>
                    <th className="py-2.5 px-4 text-right">Available Qty</th>
                    <th className="py-2.5 px-4 text-right">Simulated Ref Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {result.holdings?.map((h: any) => (
                    <tr key={h.asset_id}>
                      <td className="py-2.5 px-4 font-bold text-white">{h.symbol}</td>
                      <td className="py-2.5 px-4 text-slate-400">{h.name}</td>
                      <td className="py-2.5 px-4 uppercase text-[10px]">{h.type}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-white">
                        {parseFloat(h.quantity).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </td>
                      <td className="py-2.5 px-4 text-right text-emerald-400 font-bold">
                        {parseFloat(h.available_qty || h.quantity).toLocaleString(undefined, {
                          maximumFractionDigits: 6,
                        })}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-400">
                        ${parseFloat(h.sim_ref_price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 text-xs font-bold font-mono text-white">
              Recent Transactions (Last 10)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Tx ID</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Asset</th>
                    <th className="py-2.5 px-4 text-right">Quantity</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {result.transactions?.map((tx: any) => (
                    <tr key={tx.transaction_id}>
                      <td className="py-2.5 px-4 text-cyan-400 font-bold">#{tx.transaction_id}</td>
                      <td className="py-2.5 px-4 uppercase text-[10px]">{tx.type}</td>
                      <td className="py-2.5 px-4 text-white font-bold">{tx.symbol}</td>
                      <td className="py-2.5 px-4 text-right">
                        {parseFloat(tx.quantity).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tx.status === 'success'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-500 text-[10px]">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
