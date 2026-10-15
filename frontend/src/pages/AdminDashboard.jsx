import React, { useEffect, useState } from 'react';
import { Activity, Database, ShieldCheck, UsersRound } from 'lucide-react';
import { fetchAdminOverview } from '../services/api';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  useEffect(() => { fetchAdminOverview().then(setOverview).catch(console.error); }, []);
  const cards = [
    ['Managed users', overview?.users ?? '—', UsersRound, 'text-blue-600'], ['Mines monitored', overview?.mines ?? '—', Database, 'text-emerald-600'], ['Open findings', overview?.open_incidents ?? '—', ShieldCheck, 'text-rose-600'], ['System status', overview?.status || 'Checking', Activity, 'text-amber-600']
  ];
  return <div className="space-y-6"><div className="p-6 rounded-2xl bg-slate-900 text-white"><p className="text-xs uppercase tracking-widest text-amber-300 font-bold">System Administration</p><h2 className="mt-2 text-2xl font-bold font-['Outfit']">Platform health, access governance & audit visibility</h2><p className="mt-2 text-sm text-slate-300">Manage CoalTrack’s operational environment without altering mine records.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{cards.map(([label, value, Icon, color]) => <div key={label} className="p-5 bg-white border border-slate-200 rounded-2xl"><Icon className={`w-5 h-5 ${color}`} /><p className="mt-5 text-3xl font-bold">{value}</p><p className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</p></div>)}</div><div className="p-6 rounded-2xl bg-white border border-slate-200"><h3 className="font-bold font-['Outfit']">Administrative guardrails</h3><ul className="mt-4 text-sm text-slate-600 space-y-3"><li>• Role-protected system overview endpoint</li><li>• Signed authentication tokens with expiry enforcement</li><li>• Central mine and user records remain scoped by portal role</li></ul></div></div>;
}
