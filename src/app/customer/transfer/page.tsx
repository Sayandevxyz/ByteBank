'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRightLeft,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Clock,
  RefreshCw,
} from 'lucide-react';

const TransferCoinCanvas = dynamic(() => import('../../../components/canvas/TransferCoinCanvas'), {
  ssr: false,
  loading: () => <div className="h-48 w-full flex items-center justify-center text-slate-500 text-xs">Loading 3D Transfer Node...</div>,
});

function TransferForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAssetId = searchParams.get('assetId');

  const [holdings, setHoldings] = useState<any[]>([]);
  const [account, setAccount] = useState<any>(null);

  const [recipientAccountNo, setRecipientAccountNo] = useState('BB-ACC-5003');
  const [assetId, setAssetId] = useState<number>(1);
  const [quantity, setQuantity] = useState<string>('0.1');

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmReceipt, setConfirmReceipt] = useState<any>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [transferStatus, setTransferStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');

  useEffect(() => {
    fetch('/api/customer/holdings')
      .then((r) => r.json())
      .then((d) => {
        if (d?.holdings) {
          setHoldings(d.holdings);
          setAccount(d.account);
          if (preselectedAssetId) {
            setAssetId(parseInt(preselectedAssetId, 10));
          } else if (d.holdings.length > 0) {
            setAssetId(d.holdings[0].assetId);
          }
        }
      });
  }, [preselectedAssetId]);

  const selectedHolding = holdings.find((h) => h.assetId === assetId);

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewData(null);
    setConfirmReceipt(null);
    setTransferStatus('idle');

    try {
      const res = await fetch('/api/customer/transfer/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientAccountNo,
          assetId,
          quantity: parseFloat(quantity),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPreviewError(data.error?.message || 'Transfer preview failed.');
        return;
      }

      setPreviewData(data.preview);
    } catch {
      setPreviewError('Failed to connect to safety preview engine.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData) return;
    setConfirmLoading(true);
    setConfirmError(null);
    setTransferStatus('pending');

    const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    try {
      const res = await fetch('/api/customer/transfer/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          recipientAccountNo,
          assetId,
          quantity: parseFloat(quantity),
          authToken: previewData.authToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTransferStatus('failed');
        setConfirmError(data.error?.message || 'Transfer failed and rolled back.');
        return;
      }

      setTransferStatus('success');
      setConfirmReceipt(data);
    } catch (err: any) {
      setTransferStatus('failed');
      setConfirmError(err.message || 'Transaction failed');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Execute Asset Transfer</h1>
        <p className="text-xs text-slate-400 mt-1">
          Two-phase transfer: deterministic rule-based risk screening preview before committing ACID ledger debit & credit.
        </p>
      </div>

      <TransferCoinCanvas
        status={transferStatus}
        senderAccountNo={account?.account_no || 'BB-ACC-5001'}
        receiverAccountNo={recipientAccountNo}
        assetSymbol={selectedHolding?.symbol || 'ASSET'}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-5">
          <div className="flex items-center justify-between border-b border-[#182030] pb-3">
            <h2 className="text-sm font-semibold text-white">1. Transfer Parameters</h2>
            <span className="text-[11px] font-mono text-blue-400">Step 1 of 2</span>
          </div>

          <form onSubmit={handlePreview} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recipient Account Number (e.g. BB-ACC-5002)
              </label>
              <input
                type="text"
                required
                value={recipientAccountNo}
                onChange={(e) => setRecipientAccountNo(e.target.value.toUpperCase())}
                placeholder="BB-ACC-5003"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-[#182030] focus:border-blue-500 focus:outline-none text-xs font-mono text-white placeholder-slate-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Quick test accounts: BB-ACC-5001 (Rishi), BB-ACC-5002 (Rahul), BB-ACC-5003 (Priya), BB-ACC-5004 (Frozen Aman)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Select Asset to Send</label>
              <select
                value={assetId}
                onChange={(e) => setAssetId(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-[#182030] text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {holdings.map((h) => (
                  <option key={h.assetId} value={h.assetId}>
                    {h.name} ({h.symbol}) — Avail: {h.availableQuantity} {h.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Transfer Quantity</label>
                {selectedHolding && (
                  <button
                    type="button"
                    onClick={() => setQuantity(String(selectedHolding.availableQuantity))}
                    className="text-[10px] font-mono text-blue-400 hover:underline"
                  >
                    Max ({selectedHolding.availableQuantity})
                  </button>
                )}
              </div>
              <input
                type="number"
                step="any"
                min="0.00000001"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.1"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-[#182030] focus:border-blue-500 focus:outline-none text-xs font-mono text-white"
              />
            </div>

            {previewError && (
              <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
                {previewError}
              </div>
            )}

            <button
              type="submit"
              disabled={previewLoading || !selectedHolding}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-glow-blue transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{previewLoading ? 'Screening Risk Rules...' : 'Run Transaction Safety Preview'}</span>
            </button>
          </form>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#182030] space-y-5">
          <div className="flex items-center justify-between border-b border-[#182030] pb-3">
            <h2 className="text-sm font-semibold text-white">2. Transaction Safety Preview</h2>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Rule-Based Risk Screening</span>
          </div>

          {!previewData && !confirmReceipt && (
            <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <ShieldCheck className="w-8 h-8 text-slate-600" />
              <span>Enter transfer details and run Safety Preview to inspect recipient and risk reasons.</span>
            </div>
          )}

          {previewData && !confirmReceipt && (
            <div className="space-y-4 text-xs">

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  previewData.outcome === 'ALLOW'
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : previewData.outcome === 'REQUIRE_EXTRA_CONFIRMATION'
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
                    : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                }`}
              >
                {previewData.outcome === 'ALLOW' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : previewData.outcome === 'REQUIRE_EXTRA_CONFIRMATION' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wide">
                    OUTCOME: {previewData.outcome.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-90">
                    {previewData.outcome === 'ALLOW' && 'Transfer cleared deterministic risk screening parameters.'}
                    {previewData.outcome === 'REQUIRE_EXTRA_CONFIRMATION' && 'Secondary confirmation required before posting.'}
                    {previewData.outcome === 'REJECT' && 'Transfer blocked by database compliance rules.'}
                  </div>
                </div>
              </div>

              {previewData.reasons?.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-900 border border-[#182030] space-y-1.5">
                  <span className="font-semibold text-slate-300 text-[11px] block">Screening Rule Reasons:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                    {previewData.reasons.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 p-3 rounded-xl bg-[#0c101a] border border-[#182030] text-[11px]">
                <div className="flex justify-between py-1 border-b border-[#182030]">
                  <span className="text-slate-400">Recipient (Masked):</span>
                  <span className="font-semibold text-white">
                    {previewData.recipient.ownerMasked} ({previewData.recipient.accountNo})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#182030]">
                  <span className="text-slate-400">Transfer Amount:</span>
                  <span className="font-mono font-bold text-white">
                    {previewData.transferQuantity} {previewData.asset.symbol} (~{previewData.simulatedValueSru} SRU)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#182030]">
                  <span className="text-slate-400">Current Available:</span>
                  <span className="font-mono text-slate-300">
                    {previewData.currentAvailableQuantity} {previewData.asset.symbol}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Resulting Available Balance:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {previewData.resultingAvailableQuantity} {previewData.asset.symbol}
                  </span>
                </div>
              </div>

              {confirmError && (
                <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                  {confirmError}
                </div>
              )}

              {previewData.outcome !== 'REJECT' && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={confirmLoading}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-glow-blue transition-all disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {confirmLoading
                      ? 'Posting Atomic ACID Transfer...'
                      : previewData.outcome === 'REQUIRE_EXTRA_CONFIRMATION'
                      ? 'Confirm & Authorize Flagged Transfer'
                      : 'Confirm & Commit Transfer'}
                  </span>
                </button>
              )}
            </div>
          )}

          {confirmReceipt && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/80 text-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Transfer Committed to Double-Entry Ledger</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Transaction ID <code className="text-blue-400 font-bold">#{confirmReceipt.transaction?.transaction_id}</code> was executed atomically with paired debit and credit ledger rows.
              </p>

              <div className="p-2.5 rounded bg-slate-900 border border-[#182030] font-mono text-[11px] space-y-1">
                <div>From: {confirmReceipt.transaction?.sender_account_no}</div>
                <div>To: {confirmReceipt.transaction?.receiver_account_no}</div>
                <div>Quantity: {confirmReceipt.transaction?.quantity} {confirmReceipt.transaction?.symbol}</div>
                <div>Status: {confirmReceipt.transaction?.status?.toUpperCase()}</div>
                <div>Idempotent Replay: {confirmReceipt.idempotentReplay ? 'YES' : 'NO'}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setConfirmReceipt(null);
                    setPreviewData(null);
                    setTransferStatus('idle');
                  }}
                  className="flex-1 py-1.5 rounded bg-slate-900 border border-[#182030] text-slate-300 text-xs hover:text-white"
                >
                  New Transfer
                </button>
                <button
                  onClick={() => router.push('/customer/history')}
                  className="flex-1 py-1.5 rounded bg-blue-600 text-white text-xs hover:bg-blue-500 font-medium"
                >
                  View in History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerTransferPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-24 text-slate-500 font-mono text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-400 mr-2" />
          Loading Transfer Terminal...
        </div>
      }
    >
      <TransferForm />
    </Suspense>
  );
}
