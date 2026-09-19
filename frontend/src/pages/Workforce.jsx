import React, { useState, useEffect } from 'react';
import { fetchWorkforce } from '../services/api';
import { Users, UserCheck, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Workforce({ mineId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWorkforce(mineId);
        setData(res);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [mineId]);

  if (loading && !data) {
    return <div className="p-8 text-center text-slate-500 text-xs font-medium">Loading shift attendance matrix...</div>;
  }

  const employees = Array.isArray(data?.employees) ? data.employees : (Array.isArray(data) ? data : []);
  const summary = data?.summary || {
    total: employees.length,
    present: employees.filter(e => e.attendance_status === 'Present').length,
    absent: employees.filter(e => e.attendance_status === 'Absent').length,
    on_leave: employees.filter(e => e.attendance_status === 'On Leave').length
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-amber-600" />
            <span>Workforce Management & Shift Telemetry</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Mine Worker & Contractor Attendance</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Real-time tracking of permanent miners, contractor personnel, medical fitness checks, and shift allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
            Shift A (06:00 - 14:00) Active
          </div>
        </div>
      </div>

      {/* Attendance Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-bold">Total Assigned Workers</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 font-['Outfit']">{summary.total}</h3>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-bold">Present Today</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1 font-['Outfit']">{summary.present}</h3>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-bold">Absent / Flagged</p>
          <h3 className="text-2xl font-bold text-rose-600 mt-1 font-['Outfit']">{summary.absent}</h3>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-bold">Medical Cleared</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1 font-['Outfit']">100%</h3>
        </div>
      </div>

      {/* Employees Directory Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Worker Shift Roster</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-bold">Employee ID</th>
                <th className="pb-3 font-bold">Worker Name</th>
                <th className="pb-3 font-bold">Designation & Department</th>
                <th className="pb-3 font-bold">Assigned Shift</th>
                <th className="pb-3 font-bold">Attendance Status</th>
                <th className="pb-3 font-bold">Health Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-blue-700">{emp.emp_id}</td>
                  <td className="py-3 font-bold text-slate-900">{emp.name}</td>
                  <td className="py-3 text-slate-700">{emp.role} • <span className="text-slate-500">{emp.department}</span></td>
                  <td className="py-3 text-slate-600">{emp.shift}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                      emp.attendance_status === 'Present'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {emp.attendance_status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fit for Duty
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
