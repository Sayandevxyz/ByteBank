'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wallet,
  ArrowRightLeft,
  History,
  Shield,
  Layers,
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogOut,
  Bell,
  RefreshCw,
  FlaskConical,
  Activity,
  Sliders,
  Scale,
  Search,
  Sparkles,
} from 'lucide-react';

interface UserSession {
  userId: number;
  username: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'AUDITOR';
  fullName?: string;
  accountNo?: string;
  kycStatus?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const sse = new EventSource('/api/realtime/sse');

    sse.addEventListener('TRANSFER_RECEIVED', (e) => {
      const data = JSON.parse(e.data);
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: 'Asset Received',
          body: `Received ${data.quantity} ${data.symbol} from ${data.sender_account_no}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });

    sse.addEventListener('TRANSACTION_UPDATE', (e) => {
      const data = JSON.parse(e.data);
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: `Transaction ${data.status.toUpperCase()}`,
          body: `${data.type.toUpperCase()}: ${data.quantity} ${data.symbol}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });

    return () => sse.close();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const handleQuickSwitch = async (role: 'CUSTOMER' | 'ADMIN' | 'AUDITOR') => {
    setSwitching(true);
    let targetEmail = 'rahul.sharma@example.com';
    let targetPassword = 'password123';
    let redirectUrl = '/customer/dashboard';

    if (role === 'ADMIN') {
      targetEmail = 'rajesh.admin@bytebank.sim';
      redirectUrl = '/admin/dashboard';
    } else if (role === 'AUDITOR') {
      targetEmail = 'sunita.auditor@bytebank.sim';
      redirectUrl = '/auditor/dashboard';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });
      if (res.ok) {
        const d = await res.json();
        setUser(d.user);
        router.push(redirectUrl);
        router.refresh();
      }
    } finally {
      setSwitching(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#182030] bg-[#06080e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-glow-blue group-hover:scale-105 transition-transform">
            <span className="font-mono font-bold text-white text-base">B</span>
          </div>
          <div>
            <span className="font-bold tracking-tight text-white text-lg">
              Byte<span className="text-blue-500">Bank</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
          {user?.role === 'CUSTOMER' && (
            <>
              <Link
                href="/customer/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/customer/dashboard'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/customer/holdings"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/customer/holdings'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Holdings
              </Link>
              <Link
                href="/customer/transfer"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  pathname === '/customer/transfer'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Transfer
              </Link>
              <Link
                href="/customer/swap"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  pathname === '/customer/swap'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Swap
              </Link>
              <Link
                href="/customer/history"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  pathname === '/customer/history'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                History
              </Link>
              <Link
                href="/customer/reservations"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  pathname === '/customer/reservations'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Reservations
              </Link>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <Link
                href="/admin/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/admin/dashboard'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Admin
              </Link>
              <Link
                href="/admin/kyc"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/admin/kyc'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                KYC Review
              </Link>
              <Link
                href="/admin/accounts"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/admin/accounts'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Accounts
              </Link>
              <Link
                href="/admin/assets"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/admin/assets'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Assets
              </Link>
              <Link
                href="/admin/reconciliation"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/admin/reconciliation'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Reconciliation
              </Link>
              <Link
                href="/admin/lab"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  pathname === '/admin/lab'
                    ? 'text-white bg-purple-600 shadow-glow font-bold'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                DBMS Lab
              </Link>
            </>
          )}

          {user?.role === 'AUDITOR' && (
            <>
              <Link
                href="/auditor/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/auditor/dashboard'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Auditor
              </Link>
              <Link
                href="/auditor/transactions"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/auditor/transactions'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Masked Txns
              </Link>
              <Link
                href="/auditor/audit-logs"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/auditor/audit-logs'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Audit Trail
              </Link>
              <Link
                href="/auditor/access-logs"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/auditor/access-logs'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Access Logs
              </Link>
              <Link
                href="/auditor/reports"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/auditor/reports'
                    ? 'text-white bg-blue-600 shadow-glow-blue font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Reports
              </Link>
            </>
          )}

          {!user && (
            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
              <Link href="/admin/lab" className="px-2.5 py-1 rounded-md hover:text-white transition-colors">
                DBMS Lab
              </Link>
              <Link href="/docs" className="px-2.5 py-1 rounded-md hover:text-white transition-colors">
                API Docs
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/reconciliation"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c101a] border border-[#182030] text-[11px] font-mono text-slate-300 hover:border-blue-500/50 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>15/15 Invariants PASS</span>
          </Link>

          <div className="hidden sm:flex items-center rounded-xl bg-[#0c101a] border border-[#182030] p-0.5 text-xs font-mono">
            <button
              onClick={() => handleQuickSwitch('CUSTOMER')}
              disabled={switching}
              className={`px-2 py-1 rounded-lg transition-all ${
                user?.role === 'CUSTOMER'
                  ? 'bg-blue-600 text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cust
            </button>
            <button
              onClick={() => handleQuickSwitch('ADMIN')}
              disabled={switching}
              className={`px-2 py-1 rounded-lg transition-all ${
                user?.role === 'ADMIN'
                  ? 'bg-blue-600 text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleQuickSwitch('AUDITOR')}
              disabled={switching}
              className={`px-2 py-1 rounded-lg transition-all ${
                user?.role === 'AUDITOR'
                  ? 'bg-blue-600 text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={
                  user.role === 'ADMIN'
                    ? '/admin/dashboard'
                    : user.role === 'AUDITOR'
                    ? '/auditor/dashboard'
                    : '/customer/dashboard'
                }
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-glow-blue flex items-center gap-1.5"
              >
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/customer/dashboard"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-glow-blue flex items-center gap-1.5"
              >
                <span>Launch App</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
