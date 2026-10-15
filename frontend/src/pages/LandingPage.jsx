import React from 'react';
import { Activity, ArrowRight, BrainCircuit, FileScan, MapPinned, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';

const capabilities = [
  ['Read documents', FileScan], ['Attendance help', UsersRound], ['Safety warnings', BrainCircuit],
  ['Find dangers', ShieldCheck], ['Mine safety map', MapPinned], ['Safety tips', Sparkles]
];

export default function LandingPage({ onAccessPortal }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <section className="relative min-h-[680px] flex items-center bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.98)_5%,rgba(2,6,23,.78)_48%,rgba(2,6,23,.45)),url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=85')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(245,158,11,.18),transparent_30%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-amber-300"><span className="w-8 h-px bg-amber-300" /> Mine safety and work portal</div>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Your work and safety information in one place</p>
          <h1 className="mt-6 max-w-3xl text-5xl sm:text-7xl font-black tracking-tight font-['Outfit']">CoalTrack</h1>
          <p className="mt-5 max-w-2xl text-2xl sm:text-3xl font-semibold text-slate-100">A simple way to work safely in the mine.</p>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Check your shift, see safety warnings, report problems, and get help when you need it.</p>
          <div className="mt-9 flex flex-wrap gap-3"><button onClick={onAccessPortal} className="px-5 py-3 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-sm hover:bg-amber-300 transition flex items-center gap-2">Access secure portal <ArrowRight className="w-4 h-4" /></button><a href="#capabilities" className="px-5 py-3 rounded-xl border border-white/30 bg-white/5 font-bold text-sm hover:bg-white/10 transition">Explore capabilities</a></div>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">{[['24/7','Safety support'], ['5','User areas'], ['Live','Safety updates'], ['Map','Mine locations']].map(([value, label]) => <div key={label} className="rounded-xl border border-white/15 bg-slate-900/60 backdrop-blur p-4"><p className="text-2xl font-black text-amber-300">{value}</p><p className="mt-1 text-xs text-slate-300 font-medium">{label}</p></div>)}</div>
        </div>
      </section>
      <section id="capabilities" className="max-w-7xl mx-auto px-6 py-20"><div className="max-w-2xl"><p className="text-amber-400 text-xs uppercase tracking-[.18em] font-extrabold">Helpful tools</p><h2 className="mt-3 text-3xl font-bold font-['Outfit']">One place for safer work every day.</h2></div><div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{capabilities.map(([label, Icon]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><Icon className="w-5 h-5 text-amber-400" /><h3 className="mt-5 font-bold">{label}</h3><p className="mt-1 text-sm text-slate-400">Clear information to help you make safe choices at work.</p></div>)}</div><div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col md:flex-row md:items-center gap-5"><Activity className="w-8 h-8 text-emerald-400 shrink-0" /><div><p className="font-bold">How work moves forward</p><p className="mt-1 text-sm text-slate-400">Worker → Supervisor → Mine Manager → Safety Inspector</p></div></div></section>
    </div>
  );
}
