'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Terminal, ArrowRight, ShieldCheck } from 'lucide-react';

const RobotMascotCanvas = dynamic(() => import('../canvas/RobotMascotCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-20 h-24 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-blue-600/30 animate-pulse" />
    </div>
  ),
});

export default function BetaDropCTA() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#060911] border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        <div className="rounded-3xl bg-gradient-to-b from-[#0d1527] to-[#070b14] border border-blue-500/30 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl shadow-blue-950/30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Send your next transfer to the ledger
            </h2>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Test live ACID transfers, verify double-entry invariants, or launch the DBMS Concurrency Lab.
              No real funds, pure database engineering.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-glow-blue flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch DBMS Console</span>
              </Link>
              <Link
                href="/admin/lab"
                className="px-6 py-3 rounded-full bg-[#111827] hover:bg-[#1a2338] text-slate-300 hover:text-white border border-white/10 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Open Concurrency Lab</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute -right-12 bottom-6">
          <RobotMascotCanvas isDancing={true} className="w-24 h-28" />
        </div>
      </div>
    </section>
  );
}

