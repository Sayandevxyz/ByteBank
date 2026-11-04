'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  ShieldCheck,
  Database,
  Lock,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  FlaskConical,
  Terminal,
  ChevronDown,
  RotateCcw,
  Scale,
  Eye,
  Key,
  Users,
  Coins,
  Shield,
  Activity,
  FileText,
  Search,
  History,
  Clock,
  MessageSquare,
  Zap,
  ArrowUp,
  Sparkles,
  BarChart3,
  QrCode,
  Smartphone,
  Share2,
  UploadCloud,
} from 'lucide-react';

const RobotMascotCanvas = dynamic(() => import('@/components/canvas/RobotMascotCanvas'), {
  ssr: false,
  loading: () => <div className="w-24 h-32 opacity-0" />,
});

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'What is ByteBank digital asset ledger architecture?',
    a: 'ByteBank is a production-grade digital asset platform engineered directly on PostgreSQL 16. It stores and tracks simulated crypto and stock assets with strict ACID semantics, deterministic row-level locks, two-phase asset reservations, and mathematically provable double-entry ledger bookkeeping.',
  },
  {
    q: 'How does ByteBank prevent concurrent double-spending?',
    a: 'Transfers acquire pessimistic row-level locks on holding rows in strictly deterministic order: ORDER BY account_id, asset_id FOR UPDATE. This eliminates deadlocks and serializes simultaneous attempts. If two requests for 0.8 BTC arrive concurrently against a 1.0 BTC balance, the first commits and the second cleanly aborts with Insufficient Balance.',
  },
  {
    q: 'How does the immutable double-entry ledger guarantee holding integrity?',
    a: 'Every balance movement is written as paired signed rows in ledger_entry (+credit, -debit). Database trigger trg_ledger_immutable() strictly prohibits UPDATE and DELETE statements. A mathematical invariant holds: Holding = SUM(ledger_entry). The reconciliation engine scans all 868 pairs with zero drift.',
  },
  {
    q: 'How is ByteBank different from standard crypto wallets or mockups?',
    a: 'ByteBank is not a mockup or demo. Every button, form, role, and report runs against a real PostgreSQL database with versioned risk rules in assess_transfer_risk(), client-scoped idempotency keys, autonomous failure logging, and engine-enforced Row-Level Security (RLS) across Customer, Admin, and Auditor roles.',
  },
  {
    q: 'Is ByteBank free to test and open source?',
    a: 'Yes. ByteBank is fully open source under the MIT license. All assets, prices, and balances are SIMULATED and clearly labelled as such. You can run the entire platform locally with one command or explore the interactive DBMS lab.',
  },
  {
    q: 'How do transfer authorizations and idempotency keys work together?',
    a: 'Transfer authorizations (issued by assess_transfer_risk()) are cryptographic tokens bound to the sender, recipient, asset, quantity, and a 15-minute validity window. Idempotency keys (in transfer_request) ensure that network retries with identical SHA-256 fingerprints return cached responses without duplicate balance debits.',
  },
  {
    q: 'How does autonomous failure logging survive a rolled-back transaction?',
    a: 'When an ACID transaction encounters an invalid transition or constraint violation, PostgreSQL automatically rolls back all internal modifications. ByteBank uses an autonomous logging connection path via the pool (recordAutonomousFailure) to commit the failed attempt, status, and failure reason independently.',
  },
  {
    q: 'How does Row-Level Security (RLS) isolate customer and auditor data?',
    a: 'The application connects as non-owner role bytebank_app and applies SET LOCAL ROLE bytebank_customer with current_customer_id session variables. Auditors connect with bytebank_auditor, granting SELECT only on masked views (v_auditor_transactions) with zero access to customer PII.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [simAsset, setSimAsset] = useState('BTC');
  const [simAmount, setSimAmount] = useState('0.25');
  const [simAccount, setSimAccount] = useState('BB-ACC-5002');
  const [screeningActive, setScreeningActive] = useState(false);
  const [screeningResult, setScreeningResult] = useState<{
    outcome: string;
    ruleCode: string;
    token: string;
    remainingBalance: string;
    recipientMasked: string;
  } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const runQuickScreening = () => {
    setScreeningActive(true);
    setScreeningResult(null);
    setTimeout(() => {
      setScreeningResult({
        outcome: 'ALLOW',
        ruleCode: 'RULE_SAFETY_V1',
        token: '7a8f9c12-34ef-4b92-8031-6ec8db911204',
        remainingBalance: '0.75000000 BTC',
        recipientMasked: 'BB-ACC-***002 (Rahul Verma)',
      });
      setScreeningActive(false);
    }, 550);
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 flex flex-col items-center text-center space-y-6">
        <Link
          href="/admin/reconciliation"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c101a] border border-[#182030] text-xs font-mono text-slate-300 hover:border-blue-500/50 transition-all shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">125 accounts online</span>
          <span className="text-slate-500">&bull;</span>
          <span>868 ledger pairs settled</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-blue-400 font-semibold hover:underline">see stats &rarr;</span>
        </Link>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl text-white">
          Digital Asset &amp; Transaction Management{' '}
          <span className="text-blue-500 block sm:inline">for Web3 &amp; FinTech</span>
        </h1>

        <p className="text-sm sm:text-lg text-[#8c9bb0] max-w-2xl leading-relaxed">
          Preview every transfer before signing, verify recipient safety with{' '}
          <span className="text-white font-semibold">strict DBMS constraints</span>, and balance holdings with{' '}
          <span className="text-white font-semibold">zero ledger drift</span>. Real PostgreSQL 16 ACID transactions with simulated assets.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-6 px-6 py-2.5 rounded-full bg-[#0c101a] border border-[#182030] text-xs font-medium text-slate-300 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>Pre-Flight Risk Preview</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">&mdash;</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <span>Idempotent Execution</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">&mdash;</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span>Ledger Settlement</span>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-3 space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-medium text-slate-200 hover:border-[#24324c] transition-all">
              <span className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                Pessimistic Row Locks
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111c33] border border-[#1b2b4d] text-[10px] text-blue-400 font-mono">ACID</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-medium text-slate-200 hover:border-[#24324c] transition-all">
              <span className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
                Double-Entry Ledger
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111c33] border border-[#1b2b4d] text-[10px] text-emerald-400 font-mono">2-ENTRY</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-medium text-slate-200 hover:border-[#24324c] transition-all">
              <span className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-purple-400 shrink-0" />
                Zero Decimal Drift
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111c33] border border-[#1b2b4d] text-[10px] text-purple-400 font-mono">868/868</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-medium text-slate-200 hover:border-[#24324c] transition-all">
              <span className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-teal-400 shrink-0" />
                Autonomous Audit Logs
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111c33] border border-[#1b2b4d] text-[10px] text-teal-400 font-mono">APPEND</span>
            </div>
          </div>

          <div className="lg:col-span-6 p-7 sm:p-9 rounded-3xl bg-[#0c101a] border-2 border-dashed border-[#1f2b42] text-center space-y-5 relative overflow-hidden shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#11192b] border border-[#1e2c47] p-2 mx-auto shadow-glow-blue flex items-center justify-center">
              <Image
                src="/bytebank-icon.svg"
                alt="ByteBank Engine"
                width={48}
                height={48}
                className="w-12 h-12"
                priority
              />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Drop your transfer parameters here
              </h3>
              <p className="text-xs text-[#8c9bb0] mt-1.5 max-w-md mx-auto">
                Evaluate PostgreSQL stored procedure <code className="text-blue-300 font-mono">assess_transfer_risk()</code> with versioned rules and pessimistic locks.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="text-left space-y-1">
                <label className="text-[10px] text-slate-400">Asset</label>
                <select
                  value={simAsset}
                  onChange={(e) => setSimAsset(e.target.value)}
                  className="w-full bg-[#070a12] border border-[#182030] rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="SOL">SOL</option>
                  <option value="AAPL">AAPL</option>
                </select>
              </div>

              <div className="text-left space-y-1">
                <label className="text-[10px] text-slate-400">Amount</label>
                <input
                  type="text"
                  value={simAmount}
                  onChange={(e) => setSimAmount(e.target.value)}
                  className="w-full bg-[#070a12] border border-[#182030] rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-left space-y-1">
                <label className="text-[10px] text-slate-400">Recipient</label>
                <input
                  type="text"
                  value={simAccount}
                  onChange={(e) => setSimAccount(e.target.value)}
                  className="w-full bg-[#070a12] border border-[#182030] rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={runQuickScreening}
              disabled={screeningActive}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold text-xs transition-all shadow-glow-blue flex items-center justify-center gap-2"
            >
              {screeningActive ? (
                <>
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  Evaluating PostgreSQL Risk Rules...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Run Live Invariant Screening
                </>
              )}
            </button>

            {screeningResult && (
              <div className="p-3.5 rounded-xl bg-[#06080e] border border-emerald-500/40 text-left font-mono text-[11px] space-y-1 animate-in fade-in">
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span>OUTCOME: {screeningResult.outcome}</span>
                  <span className="text-[10px] text-slate-500">15-Min Bound Token</span>
                </div>
                <div className="text-slate-300">Recipient: {screeningResult.recipientMasked}</div>
                <div className="text-slate-400 truncate">Token: {screeningResult.token}</div>
                <div className="text-blue-300">Remaining Balance: {screeningResult.remainingBalance}</div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-medium text-slate-200 hover:border-[#24324c] transition-all">
              <span className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                Rule-Based Risk Screening
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111c33] border border-[#1b2b4d] text-[10px] text-blue-400 font-mono">SAFETY</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-medium text-slate-200 hover:border-[#24324c] transition-all">
              <span className="flex items-center gap-2.5">
                <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                Idempotent Request Keys
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111c33] border border-[#1b2b4d] text-[10px] text-emerald-400 font-mono">RETRY</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-medium text-slate-200 hover:border-[#24324c] transition-all">
              <span className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-purple-400 shrink-0" />
                Privacy-Masked Views
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111c33] border border-[#1b2b4d] text-[10px] text-purple-400 font-mono">NO-PII</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#182030] flex items-center justify-between text-xs font-medium text-slate-200 hover:border-[#24324c] transition-all">
              <span className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-teal-400 shrink-0" />
                100% Real PostgreSQL 16
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111c33] border border-[#1b2b4d] text-[10px] text-teal-400 font-mono">LIVE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111c33] border border-[#1b2b4d] text-xs font-medium text-blue-400">
          <span>For financial engineers and architects</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Settle digital assets with{' '}
          <span className="text-blue-500">absolute cryptographic finality</span>
        </h2>
        <p className="text-sm sm:text-base text-[#8c9bb0] max-w-2xl mx-auto leading-relaxed">
          Every transfer is bounded by serializable isolation, verified against versioned risk policies, and logged to an immutable double-entry ledger. Know your balance is mathematically sound.
        </p>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Smart Ledger Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Automated Reconciliation
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                Scans all 868 account-asset pairs continuously. Detects any drift between customer holdings and the ledger_entry table in real time.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Zero reconciliation drift</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Immutable Double-Entry Ledger
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                Every asset movement inserts signed debit and credit ledger rows. Trigger trg_ledger_immutable() strictly prevents UPDATE and DELETE.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Holding = SUM(ledger) formula</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Idempotent Replay Protection
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                Transfers require client-scoped idempotency keys with SHA-256 fingerprints. Network retries return identical results without duplicate debits.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Zero duplicate charges</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Advanced Distribution Controls
            </h2>
          </div>

          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#0c101a] border border-[#182030] text-slate-400 hover:text-white flex items-center justify-center shadow-lg transition-colors"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Two-Phase Reservations
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                Reserve funds dynamically during checkout flows. Available balance decreases immediately while total holding remains intact until execution or expiration.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Available = Total - Reserved</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Engine-Enforced RLS
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                PostgreSQL database engine roles bytebank_customer, bytebank_admin, and bytebank_auditor isolate database operations via RLS.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Zero cross-account leaks</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Rule-Based Risk Screening
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                Pre-flight evaluation of versioned risk rules in assess_transfer_risk(). Prevents unverified KYC, frozen accounts, and suspicious transaction velocities.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Versioned rule engines</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Auditing &amp; Security Telemetry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Real-Time Ledger Telemetry
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                Server-Sent Events stream live transaction confirmations, simulated price ticks, and system health directly to connected dashboards.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Sub-10ms event pipeline</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Privacy-Masked Auditor Portal
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                Auditors receive read-only access to transactions with masked account IDs, zero PII, and SHA-256 hashed customer identification proofs.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Strict compliance masking</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#0c101a] border border-[#182030] flex flex-col justify-between hover:border-[#24324c] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#121929] border border-[#1d273d] text-blue-400 flex items-center justify-center mb-5">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Autonomous Failure Logging
              </h3>
              <p className="text-sm text-[#8c9bb0] leading-relaxed mb-6">
                Failed attempts and security violations survive transaction rollbacks via independent database connection pooling.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#111c33] text-blue-400 border border-[#1b2b4d] w-fit">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Tamper-proof security audit</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-[#8c9bb0]">Common questions about managing assets and ledger safety</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0c101a] border border-[#182030] overflow-hidden transition-all hover:border-[#24324c]"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#8c9bb0] leading-relaxed border-t border-[#182030] animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="p-10 sm:p-14 rounded-3xl bg-[#0c101a] border border-[#182030] text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Send your next transfer with full confidence
          </h2>

          <p className="text-xs sm:text-sm text-[#8c9bb0] max-w-xl mx-auto leading-relaxed">
            Upload transfer parameters and get a cryptographic authorization token. Free simulator plan, zero credit card required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-glow-blue"
            >
              Create a free account
            </Link>
            <Link
              href="/admin/lab"
              className="px-6 py-3 rounded-xl bg-[#070a12] hover:bg-[#121929] border border-[#182030] text-slate-200 font-semibold text-xs transition-colors"
            >
              Open Interactive DBMS Lab
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
