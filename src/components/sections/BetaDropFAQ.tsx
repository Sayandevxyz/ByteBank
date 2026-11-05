'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown, HelpCircle } from 'lucide-react';

const RobotMascotCanvas = dynamic(() => import('../canvas/RobotMascotCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-20 h-24 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-blue-600/30 animate-pulse" />
    </div>
  ),
});

const FAQS = [
  {
    q: 'What is ByteBank and why are balances simulated?',
    a: 'ByteBank is an advanced Database Management System (DBMS) platform built on PostgreSQL 16. It implements enterprise-grade financial engineering: double-entry bookkeeping, strict ACID serialization, versioned risk rules, and privacy-aware auditor logging. All balances, KYC tokens, and ticker prices are synthetic to showcase real database architecture without real-world financial risk.',
  },
  {
    q: 'How does the double-entry ledger prevent balance drift?',
    a: 'Every balance modification writes a paired debit and credit ledger entry within a single atomic database transaction. Current holdings are dynamically derived using SUM(ledger_entry). A PostgreSQL database trigger strictly forbids UPDATE and DELETE on ledger rows, ensuring an untampered append-only audit trail.',
  },
  {
    q: 'How does row-level locking prevent concurrency double-spending?',
    a: 'When a transfer is initiated, ByteBank executes SELECT holding.quantity ... FOR UPDATE on the sender row. If two concurrent threads attempt to spend the same balance, PostgreSQL serializes them: Thread 1 commits, and Thread 2 aborts with an Insufficient Balance error.',
  },
  {
    q: 'What are the default test accounts and login credentials?',
    a: 'All accounts use password "password123":\n• Customer: rishi.sharma101@email.com (Account BB-ACC-5001)\n• Counterparty: rahul.verma102@email.com (Account BB-ACC-5002)\n• Admin: admin@bytebank.test\n• Auditor: auditor@bytebank.test',
  },
  {
    q: 'How does the transaction safety risk preview work?',
    a: 'Before any transfer executes, ByteBank evaluates versioned database risk rules: sender KYC status, recipient account status, velocity caps, and available balance. An assessment row stores the rule ID, version, and plain-language reason.',
  },
  {
    q: 'How does idempotent retry safety protect transactions?',
    a: 'Transfers require an Idempotency-Key header scoped per customer. ByteBank hashes the transfer payload into a SHA-256 fingerprint. Replaying the identical key and payload returns the original receipt without triggering duplicate debits.',
  },
  {
    q: 'Where can I download the complete PostgreSQL schema and dataset?',
    a: 'Visit the /download page to export the production PostgreSQL 16 schema SQL migrations, the complete 125-customer master dataset CSV, and the OpenAPI 3.1 JSON specification.',
  },
];

export default function BetaDropFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#060911] border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto space-y-12 relative">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/30 text-[11px] font-mono text-blue-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Architecture FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400">
            Common questions about ByteBank simulated digital asset architecture and ledger rules
          </p>
        </div>

        <div className="relative">
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/30 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block absolute -right-24 top-1/3">
            <RobotMascotCanvas isDancing={true} className="w-24 h-28" />
          </div>
        </div>
      </div>
    </section>
  );
}

