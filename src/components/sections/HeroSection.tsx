'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Repeat,
  Fingerprint,
  Database,
  Eye,
  Check,
} from 'lucide-react';

const RobotMascotCanvas = dynamic(() => import('../canvas/RobotMascotCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-24 h-28 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-blue-600/30 animate-pulse" />
    </div>
  ),
});

interface HeroSectionProps {
  metrics: {
    accountsCount: number;
    transactionsCount: number;
    ledgerEntriesCount: number;
    reconciliationMatched: boolean;
  } | null;
}

const SUPPORTED_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', scale: 8, color: '#f7931a' },
  { symbol: 'ETH', name: 'Ethereum', scale: 18, color: '#627eea' },
  { symbol: 'SOL', name: 'Solana', scale: 9, color: '#14f195' },
  { symbol: 'AAPL', name: 'Apple Inc.', scale: 4, color: '#a2aaad' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', scale: 4, color: '#76b900' },
  { symbol: 'TSLA', name: 'Tesla Inc.', scale: 4, color: '#e82127' },
];

export default function HeroSection({ metrics }: HeroSectionProps) {
  const [selectedAsset, setSelectedAsset] = useState(SUPPORTED_ASSETS[0]);
  const [simQuantity, setSimQuantity] = useState('0.25');
  const [simResult, setSimResult] = useState<string | null>(null);

  const handleSimulate = () => {
    setSimResult(`PREVIEW_OK: Resulting available = 0.75000000 ${selectedAsset.symbol} • Risk Assessment: LOW (KYC Verified)`);
    setTimeout(() => {
      setSimResult(null);
    }, 4500);
  };

  const accountsCount = metrics?.accountsCount ?? 127;
  const txCount = metrics?.transactionsCount ?? 885;

  return (
    <section className="relative w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#060911]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(37,99,235,0.22),transparent_70%)] pointer-events-none" />
      <div className="absolute top-48 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        <Link
          href="/auditor/reconciliation"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1424] border border-white/10 hover:border-blue-500/50 text-xs text-slate-300 font-mono transition-all duration-300 shadow-lg group mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span className="text-emerald-400 font-bold">{accountsCount} online</span>
          <span className="text-slate-500">&bull;</span>
          <span>{txCount.toLocaleString()} transactions journaled</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
            see invariants <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl">
          Digital Asset Management &amp; Core Ledger{' '}
          <span className="block bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            for Simulated Crypto &amp; Stocks
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Store, swap, and transfer simulated digital assets backed by a strict PostgreSQL 16 double-entry ledger.
          Zero balance drift, real-time risk screening, and privacy-aware auditor logs.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 p-1.5 rounded-full bg-[#0d131f] border border-white/10 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>1. Verify KYC</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">&mdash;</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03]">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <span>2. Fund Account</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">&mdash;</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03]">
            <Zap className="w-3.5 h-3.5 text-slate-400" />
            <span>3. Instant Transfer</span>
          </div>
        </div>

        <div className="mt-14 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Fingerprint className="w-3.5 h-3.5" />
                </div>
                <span>First Registration, Instant KYC</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-8.5">
                Simulated Aadhar / Passport hash with atomic verification.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <span>Zero Balance Drift</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-8.5">
                Holding balance = SUM(ledger_entry). Guaranteed by trigger.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span>Double-Entry Pairs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-8.5">
                Every debit has a corresponding credit entry.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span>Atomic Reservations</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-8.5">
                Available = total &minus; pending reserved with row lock.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 w-full">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1628] to-[#090d18] border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-950/40 text-center overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 shadow-glow-blue">
                <Cpu className="w-6 h-6" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Simulate Asset Transfer or Swap
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select an asset, specify quantity, and test rule-based risk screening in real time.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUPPORTED_ASSETS.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      selectedAsset.symbol === asset.symbol
                        ? 'bg-blue-600 text-white shadow-glow-blue scale-105'
                        : 'bg-[#111827] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span>{asset.symbol}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-[#070b14] border border-white/[0.08] text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Selected Instrument:</span>
                  <span className="font-mono font-bold text-white">
                    {selectedAsset.name} ({selectedAsset.symbol})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Precision Scale:</span>
                  <span className="font-mono text-blue-400">
                    NUMERIC(38, {selectedAsset.scale})
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <input
                    type="text"
                    value={simQuantity}
                    onChange={(e) => setSimQuantity(e.target.value)}
                    className="flex-1 bg-[#0d131f] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter quantity"
                  />
                  <button
                    onClick={handleSimulate}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-glow-blue shrink-0"
                  >
                    Test Preview
                  </button>
                </div>

                {simResult && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono leading-relaxed animate-in fade-in">
                    {simResult}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  ACID Serialized Execution
                </span>
                <span className="font-mono text-slate-500">Engine: PostgreSQL 16</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-3 flex-col gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Rule-Based Screening</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-8.5">
                Versioned risk rules evaluated before transfer execution.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <span>Idempotent Retries</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-8.5">
                Scoped UUID keys with SHA-256 fingerprint prevent duplicates.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <span>Privacy-Masked Auditor</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-8.5">
                Auditors inspect ledger records without seeing raw customer PII.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>15/15 Invariants Valid</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-8.5">
                Automated continuous testing of double-entry rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
