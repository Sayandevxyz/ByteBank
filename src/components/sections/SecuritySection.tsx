'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MintCheckItem from '@/components/ui/MintCheckItem';
import MintDotGrid from '@/components/ui/MintDotGrid';
import SecurityDonutChart from '@/components/charts/SecurityDonutChart';
import MiniAcquisitionChart from '@/components/charts/MiniAcquisitionChart';
import WaveDivider from '@/components/ui/WaveDivider';

export default function SecuritySection() {
  return (
    <section className="relative w-full bg-[#F3F7FF] py-20 overflow-hidden">
      <WaveDivider direction="to-sky" fill="#F3F7FF" className="absolute top-0 left-0 -translate-y-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B0B5C] uppercase tracking-tight leading-tight">
              Security
            </h2>

            <p className="text-base sm:text-lg text-[#5A5579] font-normal leading-relaxed max-w-xl">
              Our multi-layer relational database security system ensures every transaction, reservation, and holding balance is mathematically validated in single ACID transactions.
            </p>

            <div className="space-y-3.5 pt-2">
              <MintCheckItem text="Pessimistic row-level locks on holdings" />
              <MintCheckItem text="Idempotent transfers with SHA-256 fingerprint" />
              <MintCheckItem text="Two-phase asset reservations before commit" />
              <MintCheckItem text="PostgreSQL Row-Level Security (RLS) role isolation" />
              <MintCheckItem text="Zero-PII privacy-masked auditor access" />
            </div>

            <div className="pt-4">
              <Link
                href="/register"
                className="btn-pill-primary px-9 py-4 text-base font-semibold shadow-pill-blue"
              >
                Get Started
              </Link>
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

              <div className="relative z-10 w-4/5 ml-auto rounded-[16px] bg-white p-6 border border-[#E8ECF6] shadow-card-soft -mb-16">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-[#1B0B5C]">
                    Session By Channel
                  </h3>
                  <span className="text-[10px] text-slate-400">&bull;&bull;&bull;</span>
                </div>
                <SecurityDonutChart percentage="100%" label="Verified" />
              </div>

              <div className="relative z-20 w-4/5 rounded-[16px] bg-white p-5 border border-[#E8ECF6] shadow-card-elevated">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-[#1B0B5C]">Acquisition</h3>
                    <p className="text-[10px] text-slate-400">Continuous invariant surveillance</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#1FD6A0] animate-pulse" />
                </div>
                <MiniAcquisitionChart />
              </div>

              <div className="absolute -bottom-6 left-2 z-0">
                <MintDotGrid rows={5} cols={6} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

