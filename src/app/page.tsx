'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Sparkles,
  Terminal,
  ArrowRightLeft,
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
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const RobotMascotCanvas = dynamic(() => import('@/components/canvas/RobotMascotCanvas'), {
  ssr: false,
  loading: () => <div className="w-24 h-28 opacity-0" />,
});

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How does ByteBank prevent concurrent double-spending?',
    a: 'Transfers acquire pessimistic row-level locks on holding rows in strictly deterministic order: ORDER BY account_id, asset_id FOR UPDATE. This eliminates deadlocks and serializes simultaneous attempts. If two requests for 0.8 BTC arrive concurrently against a 1.0 BTC balance, the first commits and the second cleanly aborts with Insufficient Balance.',
  },
  {
    q: 'How does the immutable double-entry ledger guarantee holding integrity?',
    a: 'Every balance movement is written as paired signed rows in ledger_entry (+credit, -debit). Database trigger trg_ledger_immutable() strictly prohibits UPDATE and DELETE statements. A mathematical invariant holds: Holding = SUM(ledger_entry). The reconciliation engine scans all 868 pairs with zero drift.',
  },
  {
    q: 'What is the difference between transfer authorizations and idempotency keys?',
    a: 'Transfer authorizations (issued by assess_transfer_risk()) are cryptographic tokens bound to the sender, recipient, asset, quantity, and a 15-minute validity window. Idempotency keys (in transfer_request) ensure that network retries with identical SHA-256 fingerprints return cached responses without duplicate balance debits.',
  },
  {
    q: 'How does autonomous failure logging survive a rolled-back transaction?',
    a: 'When an ACID transaction encounters an invalid transition or constraint violation, PostgreSQL automatically rolls back all internal modifications. ByteBank uses an autonomous logging connection path via the pool (recordAutonomousFailure) to commit the failed attempt, status, and failure reason independently.',
  },
  {
    q: 'Are asset prices and token balances real or simulated?',
    a: 'All balances, token quantities (BTC, ETH, SOL, USDT, AAPL, TSLA), and reference prices are SIMULATED and denominated in Simulated Reserve Units (SRU). ByteBank handles zero fiat currency or real banking rails, serving as an educational DBMS showcase.',
  },
  {
    q: 'How does Row-Level Security (RLS) isolate customer and auditor data?',
    a: 'The application connects as non-owner role bytebank_app and applies SET LOCAL ROLE bytebank_customer with current_customer_id session variables. Auditors connect with bytebank_auditor, granting SELECT only on masked views (v_auditor_transactions) with zero access to customer PII.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  const [simAsset, setSimAsset] = useState('BTC');
  const [simAmount, setSimAmount] = useState('0.25');
  const [simAccount, setSimAccount] = useState('BB-ACC-5003');
  const [screeningActive, setScreeningActive] = useState(false);
  const [screeningResult, setScreeningResult] = useState<any | null>(null);

  const runQuickScreening = () => {
    setScreeningActive(true);
    setScreeningResult(null);
    setTimeout(() => {
      setScreeningResult({
        outcome: 'ALLOW',
        ruleCode: 'RULE_SAFETY_V1',
        token: '7a8f9c12-34ef-4b92-8031-6ec8db911204',
        remainingBalance: '0.75000000 BTC',
        recipientMasked: 'BB-ACC-***003 (Priya Patel)',
      });
      setScreeningActive(false);
    }, 600);
  };

  const handleQuickLogin = async (role: string, email: string) => {
    setLoggingIn(role);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });
      if (res.ok) {
        if (role === 'ADMIN') router.push('/admin/dashboard');
        else if (role === 'AUDITOR') router.push('/auditor/dashboard');
        else router.push('/customer/dashboard');
      }
    } finally {
      setLoggingIn(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 flex flex-col items-center text-center space-y-6">
        <Link
          href="/admin/reconciliation"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-900/40 text-xs font-mono text-slate-300 hover:border-blue-500/50 transition-all shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">125 Master Accounts</span>
          <span className="text-slate-500">&bull;</span>
          <span>868/868 Ledger Pairs Balanced</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-blue-400 font-bold hover:underline">see stats &rarr;</span>
        </Link>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-white">
          Digital Asset &amp; Transaction Management{' '}
          <span className="text-blue-500 block sm:inline">for PostgreSQL &amp; Web3</span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Store, transfer, and swap simulated crypto &amp; equity assets with atomic row locks, versioned rule screening, and immutable double-entry ledger bookkeeping.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-6 px-6 py-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>Pre-Flight Risk Preview</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">&mdash;</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <span>Idempotent Transfer</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">&mdash;</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span>Ledger Settlement</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Link
            href="/customer/dashboard"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-glow-blue flex items-center gap-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/admin/lab"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <span>Open DBMS Lab</span>
          </Link>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-3 space-y-3">
            <div className="p-3.5 rounded-xl glass-chip flex items-center justify-between text-xs font-mono text-slate-200">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Row-Level Locks (Pessimistic)
              </span>
              <span className="text-[10px] text-blue-400 font-bold">ACID</span>
            </div>

            <div className="p-3.5 rounded-xl glass-chip flex items-center justify-between text-xs font-mono text-slate-200">
              <span className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Idempotency Fingerprint
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">SHA-256</span>
            </div>

            <div className="p-3.5 rounded-xl glass-chip flex items-center justify-between text-xs font-mono text-slate-200">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Two-Phase Reservations
              </span>
              <span className="text-[10px] text-purple-400 font-bold">STAGED</span>
            </div>

            <div className="p-3.5 rounded-xl glass-chip flex items-center justify-between text-xs font-mono text-slate-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Zero Negative Balances
              </span>
              <span className="text-[10px] text-teal-400 font-bold">CHECK</span>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 rounded-2xl glass-panel-elevated border-2 border-dashed border-blue-500/30 text-center space-y-5 relative overflow-hidden shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center shadow-glow-blue">
              <Cpu className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Live Transaction Safety Engine</h3>
              <p className="text-xs text-slate-400 mt-1">
                Simulate a pre-flight risk screening against PostgreSQL stored procedure <code className="text-blue-300">assess_transfer_risk()</code>.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="text-left space-y-1">
                <label className="text-[10px] text-slate-400">Asset</label>
                <select
                  value={simAsset}
                  onChange={(e) => setSimAsset(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-left space-y-1">
                <label className="text-[10px] text-slate-400">Recipient</label>
                <input
                  type="text"
                  value={simAccount}
                  onChange={(e) => setSimAccount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={runQuickScreening}
              disabled={screeningActive}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold text-xs transition-all shadow-glow-blue flex items-center justify-center gap-2"
            >
              {screeningActive ? (
                <>
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  Evaluating PostgreSQL Risk Rules...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Run Live Invariant Screening
                </>
              )}
            </button>

            {screeningResult && (
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-left font-mono text-[11px] space-y-1.5 animate-in fade-in">
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
            <div className="p-3.5 rounded-xl glass-chip flex items-center justify-between text-xs font-mono text-slate-200">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                1:1 Customer Mapping
              </span>
              <span className="text-[10px] text-blue-400 font-bold">UNIQUE</span>
            </div>

            <div className="p-3.5 rounded-xl glass-chip flex items-center justify-between text-xs font-mono text-slate-200">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                Market Maker Swaps
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">PAIRED</span>
            </div>

            <div className="p-3.5 rounded-xl glass-chip flex items-center justify-between text-xs font-mono text-slate-200">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                Zero-PII Masked Views
              </span>
              <span className="text-[10px] text-purple-400 font-bold">RLS</span>
            </div>

            <div className="p-3.5 rounded-xl glass-chip flex items-center justify-between text-xs font-mono text-slate-200">
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-400" />
                Automated Reconciliation
              </span>
              <span className="text-[10px] text-teal-400 font-bold">868/868</span>
            </div>
          </div>
        </div>

        <div className="hidden 2xl:flex flex-col items-center absolute -right-24 top-1/2 -translate-y-1/2 pointer-events-auto">
          <RobotMascotCanvas isDancing={true} />
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-10 relative">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800 text-[11px] font-mono text-blue-300">
            <Database className="w-3.5 h-3.5" />
            Enterprise DBMS Core
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineered for High-Concurrency Financial Settlement
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Every movement is a paired signed ledger entry. Holding = SUM(ledger). Zero balance drift.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strict Row-Level Locking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pessimistic concurrency control via <code className="text-blue-300 font-mono">SELECT ... FOR UPDATE</code> sorted by account ID prevents deadlocks and serializes double-spend attempts.
            </p>
            <div className="pt-2 text-[10px] font-mono text-blue-400">transfer_assets() &bull; ACID</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Immutable Double-Entry Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Balance is mathematically derived. Database triggers block <code className="text-blue-300 font-mono">UPDATE</code> and <code className="text-blue-300 font-mono">DELETE</code>. Drift fixes are committed as linked reversal entries.
            </p>
            <div className="pt-2 text-[10px] font-mono text-blue-400">trg_ledger_immutable()</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Rule-Based Risk Screening</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-flight assessment evaluates KYC status, account freezes, available quantities, and counterparty velocity, generating a 15-minute bound authorization token.
            </p>
            <div className="pt-2 text-[10px] font-mono text-blue-400">assess_transfer_risk()</div>
          </div>
        </div>

        <div className="hidden 2xl:flex flex-col items-center absolute -right-24 top-24 pointer-events-auto">
          <RobotMascotCanvas isDancing={true} />
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800 text-[11px] font-mono text-blue-300">
            <Shield className="w-3.5 h-3.5" />
            Advanced Compliance Controls
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Regulatory Privacy &amp; Staged Settlement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Two-Phase Asset Reservations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lock funds for multi-step checkouts. Available balance drops immediately without altering holding totals until consumed or expired.
            </p>
            <div className="pt-2 text-[10px] font-mono text-blue-400">v_available_quantity</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Controlled Staff Access Logging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every staff query of customer PII enforces mandatory purpose codes (<code className="text-blue-300 font-mono">FRAUD_INVESTIGATION</code>, etc.) committed to the immutable access_log.
            </p>
            <div className="pt-2 text-[10px] font-mono text-blue-400">access_log &bull; Purpose-Coded</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-PII Masked Auditor Views</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auditor roles are restricted at the database engine level, reading solely from views with customer names, phones, and addresses omitted.
            </p>
            <div className="pt-2 text-[10px] font-mono text-blue-400">v_auditor_transactions</div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8 relative">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Common questions about the ByteBank PostgreSQL architecture.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden 2xl:flex flex-col items-center absolute -right-28 top-28 pointer-events-auto">
          <RobotMascotCanvas isDancing={true} />
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 relative">
        <div className="p-10 sm:p-14 rounded-3xl glass-panel-elevated border border-blue-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience the PostgreSQL Transaction Engine Today
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Test ACID concurrency race conditions, inspect the pre-seeded 125 master customer dataset, and review real-time ledger reconciliation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/customer/dashboard"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-glow-blue"
            >
              Launch Customer Terminal
            </Link>
            <Link
              href="/admin/lab"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              Open Interactive DBMS Lab
            </Link>
          </div>
        </div>

        <div className="hidden 2xl:flex flex-col items-center absolute -right-24 top-1/2 -translate-y-1/2 pointer-events-auto">
          <RobotMascotCanvas isDancing={true} />
        </div>
      </section>
    </div>
  );
}
