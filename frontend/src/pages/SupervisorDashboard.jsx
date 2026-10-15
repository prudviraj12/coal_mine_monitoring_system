import React from 'react';
import { Pickaxe, MapPin, Users, ClipboardCheck, AlertTriangle, CheckCircle2, Clock, Plus, ShieldAlert } from 'lucide-react';

export default function SupervisorDashboard({ data, onTabChange }) {
  const kpis = data?.kpis || {
    safety_score: 88,
    workforce_present: 4,
    workforce_total: 5,
    open_incidents: 2
  };

  const shiftTasks = [
    { id: 1, title: 'Inspect Bench 4 Highwall Stability', time: '07:00 AM', status: 'Completed', priority: 'High' },
    { id: 2, title: 'Verify Dumper Route 2 Water Sprinkling Schedule', time: '09:30 AM', status: 'In Progress', priority: 'Medium' },
    { id: 3, title: 'Perform Pre-Shift Respirator & Helmet Check', time: '06:15 AM', status: 'Completed', priority: 'Normal' },
    { id: 4, title: 'Log Daily Coal Face A Excavation Report', time: '01:00 PM', status: 'Pending', priority: 'Normal' }
  ];

  const recentFieldInspections = data?.recent_inspections || [
    { id: 1, title: 'Haul Road Dust Suppression Audit', inspector: 'Rajesh Kumar', location_name: 'North Access Ramp - Bench 4', date: '2026-09-17', severity: 'Medium', status: 'In Progress' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Pickaxe className="w-4 h-4 text-amber-600" />
            <span>Field Supervisor Portal — Operational Shift Command</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Ramagundam OC-II — Field Shift Log</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Managing daily bench inspections, field safety observations, and Shift A worker tasks
          </p>
        </div>

        <button
          onClick={() => onTabChange('inspections')}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4 text-amber-400 stroke-[3]" />
          Log Field Inspection
        </button>
      </div>

      {/* Field Supervisor KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Shift A Workers Present</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-1 font-['Outfit']">
                {kpis.workforce_present}/{kpis.workforce_total}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">92% On-Site (All Fit for Duty)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Active Field Hazards</p>
              <h3 className="text-3xl font-bold text-rose-700 mt-1 font-['Outfit']">
                {kpis.open_incidents} Hazards
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">Bench 3 Highwall Radar Watch</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Mine Safety Index</p>
              <h3 className="text-3xl font-bold text-blue-700 mt-1 font-['Outfit']">
                {kpis.safety_score}/100
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">Compliant with Field Safety Protocols</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Daily Shift Tasks</p>
              <h3 className="text-3xl font-bold text-emerald-700 mt-1 font-['Outfit']">
                3 / 4 Done
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">75% Task Completion Rate</p>
        </div>
      </div>

      {/* Main Grid: Supervisor Tasks & Field Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Field Tasks Checklist */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Today's Field Supervisor Roster
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200">
              Shift A Active
            </span>
          </div>

          <div className="space-y-3">
            {shiftTasks.map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{t.title}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      t.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Scheduled: {t.time}</p>
                </div>

                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                  t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Field Inspections */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              Geo-Tagged Field Inspections Log
            </h3>
            <button onClick={() => onTabChange('inspections')} className="text-xs text-blue-700 font-bold hover:underline">
              View All &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recentFieldInspections.map((insp) => (
              <div key={insp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{insp.title}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {insp.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">📍 Location: {insp.location_name}</p>
                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Inspector: {insp.inspector}</span>
                  <span className="font-bold text-blue-700">{insp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
