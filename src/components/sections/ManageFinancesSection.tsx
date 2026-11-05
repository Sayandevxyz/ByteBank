'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MiniAcquisitionChart from '@/components/charts/MiniAcquisitionChart';
import MintDotGrid from '@/components/ui/MintDotGrid';

interface ManageFinancesSectionProps {
  metrics?: {
    reconciliationRate: number;
    averageVerificationMs: string;
    recentTransactions?: Array<{
      transaction_id: number;
      type: string;
      quantity: string | number;
      symbol: string;
      created_at: string;
      sender_name?: string;
    }>;
  };
}

const DEFAULT_TXNS = [
  { initial: 'B', color: 'bg-[#3B5BFF]', title: 'Bitcoin Receipt', date: 'Today, 08:30 AM', amount: '+0.50 BTC', status: 'Completed' },
  { initial: 'E', color: 'bg-[#F43F6E]', title: 'Ethereum Swap', date: 'Today, 07:15 AM', amount: '-2.40 ETH', status: 'Completed' },
  { initial: 'S', color: 'bg-[#1FD6A0]', title: 'Solana Transfer', date: 'Today, 06:45 AM', amount: '+15.0 SOL', status: 'Completed' },
  { initial: 'U', color: 'bg-[#FFAB2E]', title: 'USDT Settlement', date: 'Today, 05:20 AM', amount: '+500 USDT', status: 'Completed' },
];

export default function ManageFinancesSection({ metrics }: ManageFinancesSectionProps) {
  const reconciliationRate = metrics?.reconciliationRate || 100;
  const latency = metrics?.averageVerificationMs || '0.25ms';

  return (
    <section className="w-full bg-[#F3F7FF] py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 relative flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[460px]">
              <div className="absolute -top-6 -left-6 z-0">
                <MintDotGrid rows={6} cols={6} />
              </div>

              <div className="relative z-10 w-4/5 rounded-[16px] bg-white p-5 border border-[#E8ECF6] shadow-card-soft -mb-16">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-[#1B0B5C]">Acquisition</h3>
                    <p className="text-[10px] text-slate-400">Total volume rate by currency</p>
                  </div>
                  <span className="text-[10px] text-slate-400">&bull;&bull;&bull;</span>
                </div>
                <MiniAcquisitionChart />
              </div>

              <div className="relative z-20 w-full rounded-[16px] bg-white p-6 border border-[#E8ECF6] shadow-card-elevated">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1B0B5C]">
                    Transaction History
                  </h3>
                  <span className="text-[11px] font-semibold text-[#0B4FFF]">
                    View all
                  </span>
                </div>

                <div className="space-y-3.5">
                  {DEFAULT_TXNS.map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${tx.color} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm`}
                        >
                          {tx.initial}
                        </div>
                        <div>
                          <div className="font-semibold text-[#1B0B5C] leading-snug">
                            {tx.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {tx.date}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-0.5">
                        <span className="font-semibold text-[#1B0B5C]">
                          {tx.amount}
                        </span>
                        <span className="text-[9px] font-semibold text-[#1FD6A0] bg-[#1FD6A0]/10 px-1.5 py-0.5 rounded-full">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6 lg:pl-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B0B5C] uppercase tracking-tight leading-tight">
              Manage Your Finances
            </h2>

            <p className="text-base sm:text-lg text-[#5A5579] font-normal leading-relaxed max-w-xl">
              Make payments on the go moment to moment through our verified ACID ledger platform with full double-entry guarantees.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#1B0B5C] tracking-tight">
                  {reconciliationRate}%
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Ledger Invariant Adherence
                </div>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#1B0B5C] tracking-tight">
                  {latency}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Average Invariant Latency
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

