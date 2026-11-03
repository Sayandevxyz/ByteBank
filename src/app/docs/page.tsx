'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Code,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((r) => r.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const copyCurl = (path: string, method: string) => {
    const curl = `curl -X ${method.toUpperCase()} http://localhost:3000${path} -H "Content-Type: application/json"`;
    navigator.clipboard.writeText(curl);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-400 font-mono text-sm">
        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 mr-2" />
        Loading OpenAPI Specification...
      </div>
    );
  }

  const paths = spec?.paths || {};

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-semibold">
              OPENAPI 3.1 SPECIFICATION
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              REST &bull; JSON &bull; SSE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">ByteBank API Reference</h1>
          <p className="text-xs text-slate-400 mt-1">
            Standardized endpoints for authentication, rule-based transfer preview, retry-safe settlement, and staff audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            Raw OpenAPI JSON
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(paths).map(([path, methods]: [string, any]) => {
          return Object.entries(methods).map(([method, details]: [string, any]) => {
            const methodUpper = method.toUpperCase();
            const methodColor =
              methodUpper === 'GET'
                ? 'bg-blue-950/80 border-blue-800 text-blue-400'
                : methodUpper === 'POST'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                : methodUpper === 'PATCH'
                ? 'bg-amber-950/80 border-amber-800 text-amber-400'
                : 'bg-rose-950/80 border-rose-800 text-rose-400';

            return (
              <div
                key={`${path}-${method}`}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-bold border ${methodColor}`}
                    >
                      {methodUpper}
                    </span>
                    <span className="text-white font-bold text-sm">{path}</span>
                  </div>

                  <button
                    onClick={() => copyCurl(path, method)}
                    className="text-slate-400 hover:text-white text-[11px] flex items-center gap-1 self-start sm:self-auto"
                  >
                    {copiedPath === path ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied cURL!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy cURL
                      </>
                    )}
                  </button>
                </div>

                <div className="text-slate-300 font-sans text-xs">
                  {details.summary || details.description}
                </div>

                {details.parameters && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Headers / Parameters:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {details.parameters.map((p: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[10px]"
                        >
                          {p.name} {p.required && <strong className="text-rose-400">*</strong>} (
                          {p.in})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
