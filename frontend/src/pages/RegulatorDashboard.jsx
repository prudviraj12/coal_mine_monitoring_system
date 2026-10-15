import React from 'react';
import { ShieldCheck, Building, FileText, CheckSquare, Download, AlertTriangle, Activity, Globe } from 'lucide-react';

export default function RegulatorDashboard({ data, onTabChange }) {
  const complianceRules = data?.compliance_rules || [
    { id: 1, authority: 'DGMS', title: 'Quarterly Ventilation & Slope Audit', category: 'Safety', due_date: '2026-09-30', status: 'Warning', score: 78, mine_name: 'Ramagundam OC-II' },
    { id: 2, authority: 'MoEFCC', title: 'Ambient PM10 Emission Return', category: 'Environmental', due_date: '2026-10-15', status: 'Compliant', score: 95, mine_name: 'Ramagundam OC-II' },
    { id: 3, authority: 'CPCB', title: 'Mine Water Discharge Check', category: 'Environmental', due_date: '2026-09-25', status: 'Pending', score: 88, mine_name: 'Jharia Underground Block-3' }
  ];

  const nationalMines = [
    { id: 1, name: 'Ramagundam OC-II', subsidiary: 'Singareni Collieries Company Limited', location: 'Ramagundam, Telangana', score: 88, status: 'Audit Passed', dgmsRef: 'DGMS/CMR-2017/1042' },
    { id: 2, name: 'Jharia Underground Block-3', subsidiary: 'BCCL', location: 'Jharkhand', score: 79, status: 'Under Inspection', dgmsRef: 'DGMS/CMR-2017/0881' },
    { id: 3, name: 'Singrauli North Quarry', subsidiary: 'NCL', location: 'Madhya Pradesh', score: 93, status: 'Audit Passed', dgmsRef: 'DGMS/CMR-2017/1290' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Directorate General of Mines Safety (DGMS) Portal</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">National Coal Mine Statutory Oversight & Audit Hub</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Multi-subsidiary governance framework monitoring DGMS CMR 2017, MoEFCC PARIVESH, CPCB & Labour returns
          </p>
        </div>

        <button
          onClick={() => onTabChange('compliance')}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Download className="w-4 h-4 text-amber-300" />
          Export DGMS Audit Dossier
        </button>
      </div>

      {/* Regulator National KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">National Compliance Rating</p>
              <h3 className="text-3xl font-bold text-emerald-700 mt-1 font-['Outfit']">86.7%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">Across Singareni, BCCL & NCL mines</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Active Mines Audited</p>
              <h3 className="text-3xl font-bold text-blue-700 mt-1 font-['Outfit']">3 / 3 Mines</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">100% Real-time Telemetry Synced</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Statutory Deadlines Pending</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-1 font-['Outfit']">2 Returns</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">CPCB Discharge & CMR 160 Audit</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-rose-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Violation Notices Issued</p>
              <h3 className="text-3xl font-bold text-rose-700 mt-1 font-['Outfit']">1 Warning</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">Bench 3 Highwall Displace Alert</p>
        </div>
      </div>

      {/* Multi-Mine Subsidiary Overview */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Coal India Subsidiaries Audit Directory</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-bold">Mine Block Name</th>
                <th className="pb-3 font-bold">Subsidiary</th>
                <th className="pb-3 font-bold">Location</th>
                <th className="pb-3 font-bold">DGMS Clear Ref</th>
                <th className="pb-3 font-bold">Compliance Score</th>
                <th className="pb-3 font-bold">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {nationalMines.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-slate-900">{m.name}</td>
                  <td className="py-3 font-extrabold text-blue-700">{m.subsidiary}</td>
                  <td className="py-3 text-slate-700">{m.location}</td>
                  <td className="py-3 font-mono text-[11px] text-slate-600">{m.dgmsRef}</td>
                  <td className="py-3 font-bold text-emerald-700">{m.score}%</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                      m.status === 'Audit Passed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Rules Monitor */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Statutory Compliance Filings (DGMS / MoEFCC / CPCB)</h3>
          <button onClick={() => onTabChange('compliance')} className="text-xs text-blue-700 font-bold hover:underline">
            Manage Rules & Calendar &rarr;
          </button>
        </div>

        <div className="space-y-3">
          {complianceRules.map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {r.authority}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{r.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">Mine: {r.mine_name} • Category: {r.category} • Due: {r.due_date}</p>
              </div>

              <span className={`text-xs px-3 py-1 rounded-xl font-extrabold uppercase ${
                r.status === 'Compliant'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : r.status === 'Warning'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
