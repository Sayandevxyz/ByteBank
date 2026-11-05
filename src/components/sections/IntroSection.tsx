'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function IntroSection() {
  return (
    <section className="w-full bg-[#F3F7FF] pt-14 pb-12 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#1B0B5C] tracking-tight">
            Storing and managing your digital assets made easier
          </h2>

          <p className="text-base sm:text-lg text-[#5A5579] font-normal leading-relaxed max-w-2xl mx-auto">
            Experience real PostgreSQL 16 ACID transactions, deterministic row-level locks, and mathematically balanced double-entry ledger bookkeeping.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

