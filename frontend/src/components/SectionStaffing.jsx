import React, { useEffect, useState } from 'react';
import { HardHat, Users } from 'lucide-react';
import { fetchSectionStaffing } from '../services/api';

export default function SectionStaffing() {
  const [staffing, setStaffing] = useState(null);

  useEffect(() => {
    fetchSectionStaffing().then(setStaffing).catch(console.error);
  }, []);

  const sections = staffing?.sections || [];
  const workerTotal = sections.reduce((total, section) => total + section.worker_count, 0);

  return (
    <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Today’s work areas</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900 font-['Outfit']">Ramagundam OC-II — supervisor and worker count</h3>
          <p className="mt-1 text-sm text-slate-600">One supervisor is responsible for each section during the active shift.</p>
        </div>
        <div className="text-sm font-bold text-slate-700"><span className="text-2xl text-slate-900">{workerTotal}</span> workers in {staffing?.shift || 'the active shift'}</div>
      </div>
      <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {sections.map(section => (
          <article key={section.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-bold text-slate-900 text-sm">{section.name}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-700"><HardHat className="w-4 h-4 text-amber-600" /><span>{section.supervisor_name}</span></div>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-blue-700"><Users className="w-4 h-4" /><span>{section.worker_count} workers</span></div>
          </article>
        ))}
      </div>
      {!sections.length && <p className="py-6 text-sm text-slate-500">Loading section staffing details…</p>}
    </section>
  );
}
