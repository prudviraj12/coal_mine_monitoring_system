import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, UserRound } from 'lucide-react';
import { clearAuthSession, loginUser } from '../services/api';
import { roleById } from '../config/roles';

const demoCredentials = {
  worker: ['worker@coaltrack.gov.in', 'work123'], supervisor: ['supervisor@coaltrack.gov.in', 'sup123'],
  manager: ['manager@coaltrack.gov.in', 'man123'], regulator: ['regulator@coaltrack.gov.in', 'reg123'], admin: ['admin@coaltrack.gov.in', 'admin123']
};

export default function LoginPage({ selectedRole = 'worker', onBack, onLoginSuccess }) {
  const role = roleById(selectedRole);
  const Icon = role.icon;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const authenticate = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(...credentials);
      if (data.user.role !== selectedRole) {
        clearAuthSession();
        throw new Error(`This account is authorised for the ${roleById(data.user.role).title} portal.`);
      }
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Government authentication is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const submit = event => { event.preventDefault(); authenticate([email, password]); };
  const useDemo = () => {
    const [demoEmail, demoPassword] = demoCredentials[selectedRole];
    setEmail(demoEmail);
    setPassword(demoPassword);
    authenticate([demoEmail, demoPassword]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center px-5 py-10">
      <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl shadow-black/30">
        <section className="p-8 sm:p-12 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,.22),transparent_42%),linear-gradient(135deg,#172554,#020617)]">
          <button onClick={onBack} className="text-sm font-bold text-slate-300 hover:text-white flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Change portal</button>
          <div className="mt-16"><div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-amber-400 text-slate-950"><Icon className="w-7 h-7" /></div>
            <p className="mt-8 text-xs uppercase tracking-[.18em] font-bold text-amber-300">Selected authorised role</p><h1 className="mt-3 text-4xl font-black font-['Outfit']">{role.title}</h1><p className="mt-4 max-w-sm text-slate-300 leading-7">{role.description}</p>
            <div className="mt-10 space-y-3">{role.responsibilities.map(item => <div key={item} className="flex items-center gap-3 text-sm text-slate-200"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {item}</div>)}</div>
          </div>
        </section>
        <section className="bg-white text-slate-900 p-8 sm:p-12"><div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider"><ShieldCheck className="w-4 h-4" /> Government digital authentication</div><h2 className="mt-4 text-2xl font-bold font-['Outfit']">Secure sign in</h2><p className="mt-2 text-sm text-slate-500">Use your registered employee email and password.</p>
          {error && <div className="mt-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">{error}</div>}
          <form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-bold">Employee ID / official email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@coaltrack.gov.in" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-medium outline-none focus:border-slate-900" /></label><label className="block text-sm font-bold">Password<div className="relative mt-2"><Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" /><input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-3 font-medium outline-none focus:border-slate-900" /></div></label><label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /> Remember this authorised device</label><button disabled={loading} className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 transition">{loading ? 'Verifying identity…' : 'Access secure portal'}</button></form>
          <button disabled={loading} onClick={useDemo} className="mt-4 w-full rounded-xl border border-slate-300 py-3 text-sm font-bold hover:bg-slate-50 disabled:opacity-60">Use {role.title} demo account</button><p className="mt-6 text-xs text-slate-500 flex items-center gap-2"><UserRound className="w-4 h-4" /> Audit logging is enabled for all sign-ins.</p>
        </section>
      </div>
    </main>
  );
}
