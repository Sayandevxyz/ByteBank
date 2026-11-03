'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, FileText, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2000-01-15');
  const [idType, setIdType] = useState('PAN');
  const [idProofNumber, setIdProofNumber] = useState('PAN-DEMO9901Z');
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          address,
          dateOfBirth,
          idProofNumber,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || 'Registration failed');
        return;
      }

      router.push('/customer/dashboard');
      router.refresh();
    } catch {
      setError('Connection failed. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg glass-panel p-8 rounded-2xl border border-[#182030] shadow-glass">

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#182030] text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${
                step >= 1 ? 'bg-blue-500 text-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              1
            </span>
            <span className={step >= 1 ? 'text-white font-semibold' : 'text-slate-400'}>Account Details</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${
                step >= 2 ? 'bg-blue-500 text-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? 'text-white font-semibold' : 'text-slate-400'}>Simulated KYC</span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Open ByteBank Account</h1>
          <p className="text-xs text-slate-400 mt-1">
            {step === 1 ? 'Step 1: Master profile information' : 'Step 2: Identity document hash & security credentials'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aditya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email (Unique)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aditya@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Unique)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543999"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Physical Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="25 MG Road, Bengaluru 560001"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (fullName && email && phone && address) setStep(2);
                  else setError('Please complete all personal fields before proceeding');
                }}
                className="w-full py-2.5 mt-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-glow-blue transition-all"
              >
                <span>Continue to Simulated KYC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-[#111c33]/30 border border-blue-800/60 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy-Preserving KYC Simulation</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  ByteBank stores only cryptographic SHA-256 hashes and the non-sensitive last 4 digits (e.g. <code>9901</code>)
                  in the customer table to prevent PII exposure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ID Document Type</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="PAN">PAN Card</option>
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Simulated ID Number</label>
                  <input
                    type="text"
                    required
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    placeholder="PAN-ABCDE1234F"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0c101a] border border-[#182030] focus:border-blue-500 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-900 border border-[#182030] text-slate-300 hover:text-white text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-glow-blue disabled:opacity-50"
                >
                  <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
