'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Terminal, Copy, Check, Code2, Cpu } from 'lucide-react';

const RobotMascotCanvas = dynamic(() => import('../canvas/RobotMascotCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-20 h-24 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-blue-600/30 animate-pulse" />
    </div>
  ),
});

const CODE_EXAMPLES = {
  curl: `curl -X POST http://localhost:3000/api/customer/transfer \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: c9b2a1e4-3b56-4c8d-9f12-001122334455" \\
  -H "Authorization: Bearer \${ACCESS_TOKEN}" \\
  -d '{
    "toAccountNo": "BB-ACC-5002",
    "symbol": "BTC",
    "quantity": "0.10000000",
    "note": "Payment for software license"
  }'`,
  node: `const response = await fetch('http://localhost:3000/api/customer/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(),
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    toAccountNo: 'BB-ACC-5002',
    symbol: 'ETH',
    quantity: '1.500000000000000000'
  })
});
const data = await response.json();`,
  sql: `-- Direct PostgreSQL 16 ACID Transaction:
BEGIN;
SELECT holding.quantity - COALESCE(SUM(ar.quantity), 0)
  FROM holding
  LEFT JOIN asset_reservation ar 
    ON ar.account_id = holding.account_id 
   AND ar.asset_id = holding.asset_id 
   AND ar.status = 'ACTIVE'
 WHERE holding.account_id = 5001 AND holding.asset_id = 1
 FOR UPDATE;

INSERT INTO ledger_entry (account_id, asset_id, amount, balance_after)
VALUES (5001, 1, -0.10000000, 0.90000000);
COMMIT;`,
};

export default function ApiCliSection() {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'sql'>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#060911] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/30 text-[11px] font-mono text-blue-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Developer-First Platform</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Execute transfers from Console, the CLI or an AI agent
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automate digital asset movements via REST API, query live holdings through Server-Sent Events, or test
              row-level locking concurrency directly in PostgreSQL 16.
            </p>
          </div>

          <div className="hidden md:block">
            <RobotMascotCanvas isDancing={true} className="w-24 h-28" />
          </div>
        </div>

        <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] shadow-2xl overflow-hidden">
          <div className="px-4 py-3 bg-[#080d17] border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">bash &mdash; bytebank-client</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#05070d] p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('curl')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    activeTab === 'curl' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveTab('node')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    activeTab === 'node' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => setActiveTab('sql')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    activeTab === 'sql' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Raw SQL
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                title="Copy snippet"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-6 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed bg-[#090e1a]">
            <pre className="text-blue-300/90">{CODE_EXAMPLES[activeTab]}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

