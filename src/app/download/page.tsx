import React from 'react';
import Link from 'next/link';
import { Download, Database, FileSpreadsheet, Code, FileText, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Download Architecture & Data Packs | ByteBank',
  description: 'Download the complete PostgreSQL 16 schema, 125-customer synthetic dataset, and OpenAPI specification.',
};

const DOWNLOADS = [
  {
    title: 'Complete PostgreSQL 16 Schema Pack',
    filename: 'bytebank-complete-schema.sql',
    format: 'SQL DDL & Triggers',
    size: '46 KB',
    desc: 'All migrations containing table definitions, CHECK constraints, immutability triggers, PL/pgSQL transfer procedures, and Row-Level Security policies.',
    url: '/api/download/schema',
    icon: Database,
    color: 'text-blue-400',
    bgColor: 'bg-blue-600/20',
  },
  {
    title: '125 Master Customer Synthetic Dataset',
    filename: 'bytebank-125-customers.csv',
    format: 'CSV Spreadsheet',
    size: '18 KB',
    desc: 'The complete seeded dataset of 125 synthetic master customers with unique emails, phone numbers, verified KYC statuses, and generated account numbers.',
    url: '/api/download/dataset',
    icon: FileSpreadsheet,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-600/20',
  },
  {
    title: 'OpenAPI 3.1 REST Specification',
    filename: 'bytebank-openapi-3.1.json',
    format: 'JSON Spec',
    size: '24 KB',
    desc: 'Full OpenAPI 3.1.0 specification defining all 53 endpoints, request schemas, Zod validation models, and HTTP response codes.',
    url: '/api/download/openapi',
    icon: Code,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-600/20',
  },
];

export default function DownloadPage() {
  return (
    <div className="w-full bg-[#060911] text-white min-h-screen">
      <section className="relative w-full pt-16 pb-16 bg-[#080d18] border-b border-white/[0.06] text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1424] border border-blue-500/30 text-xs font-mono text-blue-400 mb-6 shadow-glow-blue">
            <span>Download Center &amp; Open Artifacts</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Download Data Pack
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Download verifiable database schema files, synthetic customer data, and API contracts directly from the platform.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DOWNLOADS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.filename}
                className="rounded-3xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 p-8 flex flex-col justify-between transition-all group shadow-card-dark"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${item.bgColor} border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                      {item.size}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                      {item.format}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1">
                      {item.title}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-8">
                  <a
                    href={item.url}
                    download={item.filename}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-blue"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {item.filename}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#080d18] border-t border-white/[0.06] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Need live database verification?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            You can run automated database invariant tests or launch the concurrency race simulator directly against your local PostgreSQL instance.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/lab"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111827] hover:bg-[#1a2338] text-white border border-white/10 text-xs font-semibold transition-all"
            >
              <span>Explore DBMS Concurrency Lab</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
