import React, { useState } from 'react';
import { Pickaxe, ShieldCheck, Building2, HardHat, Lock, Mail, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { loginUser } from '../services/api';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'worker',
      label: 'Mine Worker Portal',
      email: 'worker@coaltrack.gov.in',
      pass: 'work123',
      icon: HardHat,
      desc: 'Check your attendance, monthly pay, shift schedule & report safety issues.',
      badge: 'Mine Worker',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    {
      role: 'supervisor',
      label: 'Field Supervisor Portal',
      email: 'supervisor@coaltrack.gov.in',
      pass: 'sup123',
      icon: Pickaxe,
      desc: 'Daily shift attendance, site safety checks & worker shift tasks.',
      badge: 'Supervisor',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      role: 'manager',
      label: 'Mine Manager Portal',
      email: 'manager@coaltrack.gov.in',
      pass: 'man123',
      icon: Building2,
      desc: 'Overall mine production status, worker shifts & safety management.',
      badge: 'Mine Manager',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      role: 'regulator',
      label: 'Government Inspector (DGMS)',
      email: 'regulator@coaltrack.gov.in',
      pass: 'reg123',
      icon: ShieldCheck,
      desc: 'Government safety compliance, audit reports & mine inspection status.',
      badge: 'Government DGMS',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      if (data.user) {
        onLoginSuccess(data.user);
      } else {
        setError('Invalid login credentials.');
      }
    } catch (err) {
      setError('Unable to connect to Government Auth Node.');
    }
    setLoading(false);
  };

  const handleQuickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(acc.email, acc.pass);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Inter',sans-serif] flex flex-col justify-between">
      {/* Top Ministry Banner */}
      <header className="bg-slate-900 text-white px-6 py-4 border-b-4 border-amber-500 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-slate-900 rounded-xl shadow-xs">
              <Pickaxe className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-['Outfit'] tracking-tight">CoalTrack AI</h1>
                <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-black px-2 py-0.5 rounded">
                  SIH 2026 Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Ministry of Coal & DGMS Smart Governance Portal
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>NIC Secure Portal (256-Bit SSL Encrypted)</span>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        {/* Left Column: Quick Role Selection Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Authorized Portal Access
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-['Outfit']">
              Select Your Role to Login
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Access role-specific compliance monitoring, inspection reporting, and statutory dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              return (
                <div
                  key={acc.role}
                onClick={() => !loading && handleQuickLogin(acc)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-amber-400 text-slate-800 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${acc.badgeColor}`}>
                      {acc.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition font-['Outfit']">
                      {acc.label}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                      {acc.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    <span>Login as {acc.role.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Formal Credentials Form */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">User Credentials Login</h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">Enter your official government / employee ID credentials</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="supervisor@coaltrack.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              {loading ? 'Authenticating...' : 'Sign In to Government Portal'}
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium text-center">
            🔒 Audit trail logging is active for all statutory sign-ins under IT Act 2000.
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-600 font-medium">
        Ministry of Coal • Directorate General of Mines Safety (DGMS) • CoalTrack AI Platform © 2026
      </footer>
    </div>
  );
}
