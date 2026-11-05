'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DeviceSessionChart from '@/components/charts/DeviceSessionChart';
import MintDotGrid from '@/components/ui/MintDotGrid';

interface AssetTransactionsSectionProps {
  metrics?: {
    totalAccounts: number;
    fee: string;
  };
}

export default function AssetTransactionsSection({ metrics }: AssetTransactionsSectionProps) {
  const accountCount = metrics?.totalAccounts || 125;
  const fee = metrics?.fee || '$0.00';

  return (
    <section className="w-full bg-white py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B0B5C] uppercase tracking-tight leading-tight">
              Asset Transactions
            </h2>

            <p className="text-base sm:text-lg text-[#5A5579] font-normal leading-relaxed max-w-xl">
              Settle simulated crypto and equity transfers with absolute serializable ACID isolation, zero slippage, and instantaneous ledger balance updates.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#1B0B5C] tracking-tight">
                  {accountCount}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Verified Master Accounts
                </div>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#1B0B5C] tracking-tight">
                  {fee}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Simulation Network Fee
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[460px]">
              <div className="absolute -top-6 -right-6 z-0">
                <MintDotGrid rows={7} cols={6} />
              </div>

              <div className="relative z-10 w-4/5 rounded-[16px] bg-white p-5 border border-[#E8ECF6] shadow-card-soft -mb-16">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#1B0B5C]">
                    Agent Performance Points
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B5BFF]" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-[#1B0B5C]">
                      RS
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] font-semibold text-[#1B0B5C]">
                        <span>Rishi Sharma</span>
                        <span className="text-[#3B5BFF]">98/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-[#3B5BFF] h-full rounded-full w-[98%]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-800">
                      VD
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] font-semibold text-[#1B0B5C]">
                        <span>Vikram Desai</span>
                        <span className="text-[#1FD6A0]">100/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-[#1FD6A0] h-full rounded-full w-[100%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-20 w-full rounded-[16px] bg-white p-6 border border-[#E8ECF6] shadow-card-elevated">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1B0B5C]">
                    Device Session
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                    <span className="text-[#0B4FFF] font-semibold">Live</span>
                    <span>&bull;</span>
                    <span>Monthly</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1 mb-2 border-b border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Active</div>
                    <div className="text-sm font-bold text-[#1B0B5C]">4,249</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Session</div>
                    <div className="text-sm font-bold text-[#1B0B5C]">4,569</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Settled</div>
                    <div className="text-sm font-bold text-[#1B0B5C]">4,949</div>
                  </div>
                </div>

                <DeviceSessionChart />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

