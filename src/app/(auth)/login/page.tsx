'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || 'Login failed. Check your credentials.');
        return;
      }

      if (data.user.role === 'ADMIN') router.push('/admin/dashboard');
      else if (data.user.role === 'AUDITOR') router.push('/auditor/dashboard');
      else router.push('/customer/dashboard');

      router.refresh();
    } catch {
      setError('Connection failed. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-[#182030] shadow-glass">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3 hover:opacity-90 transition-opacity">
            <Image
              src="/bytebank-logo.svg"
              alt="ByteBank Logo"
              width={260}
              height={82}
              className="mx-auto"
              priority
            />
          </Link>
          <p className="text-xs text-slate-400">PostgreSQL Authenticated Digital Asset Account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address or Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rishi.sharma101@email.com or admin"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-glow-blue transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#182030] text-xs">
          <span className="text-[11px] font-mono text-slate-400 block mb-2.5">CLICK TO AUTOFILL DEMO LOGIN:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPreset('rishi.sharma101@email.com')}
              className="p-2 rounded bg-slate-900 border border-slate-850 hover:border-blue-500 text-left transition-colors"
            >
              <div className="font-semibold text-blue-400">Customer</div>
              <div className="text-[10px] text-slate-400 truncate">Rishi Sharma</div>
            </button>

            <button
              type="button"
              onClick={() => setPreset('admin@bytebank.test')}
              className="p-2 rounded bg-slate-900 border border-slate-850 hover:border-amber-500 text-left transition-colors"
            >
              <div className="font-semibold text-amber-400">Admin</div>
              <div className="text-[10px] text-slate-400 truncate">Vikram Desai</div>
            </button>

            <button
              type="button"
              onClick={() => setPreset('auditor@bytebank.test')}
              className="p-2 rounded bg-slate-900 border border-slate-850 hover:border-violet-500 text-left transition-colors"
            >
              <div className="font-semibold text-violet-400">Auditor</div>
              <div className="text-[10px] text-slate-400 truncate">Karthik Menon</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Need an account?{' '}
          <Link href="/register" className="text-blue-400 hover:underline font-medium">
            Register new customer
          </Link>
        </div>
      </div>
    </div>
  );
}
