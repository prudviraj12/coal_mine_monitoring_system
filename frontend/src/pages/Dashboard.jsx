import React from 'react';
import {
  ShieldAlert,
  Pickaxe,
  Users,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  FileCheck,
  Building,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import SectionStaffing from '../components/SectionStaffing';

export default function Dashboard({ data, role, onTabChange }) {
  const defaultData = {
    mine: { name: 'Ramagundam OC-II', subsidiary: 'Singareni Collieries Company Limited', state: 'Telangana' },
    kpis: {
      compliance_score: 92,
      safety_score: 88,
      workforce_total: 450,
      workforce_present: 412,
      open_incidents: 3,
      production_actual: 114500,
      production_target: 120000
    },
    compliance_rules: [
      { id: 1, authority: 'DGMS', title: 'Mines Act 1952 - Section 22 Safety Audit', category: 'Statutory Safety', due_date: '2026-10-15', status: 'Compliant', score: 95 },
      { id: 2, authority: 'CPCB', title: 'Environmental Clearance Dust Telemetry', category: 'Environmental', due_date: '2026-09-30', status: 'In Review', score: 88 },
      { id: 3, authority: 'DGMS', title: 'Slope Stability & Bench Audit (Reg 106)', category: 'Structural', due_date: '2026-10-01', status: 'Compliant', score: 94 }
    ],
    recent_inspections: [
      { id: 101, title: 'Open Pit Bench 4 Stability Check', inspector: 'Rajesh Kumar (Supervisor)', date: '2026-09-18', status: 'Passed', risk_level: 'Low' },
      { id: 102, title: 'Heavy Haulage Truck Braking Test', inspector: 'Suresh Patel', date: '2026-09-17', status: 'Action Required', risk_level: 'Medium' }
    ],
    ai_insights: [
      { id: 1, title: 'High Dust Concentration Risk at Pit Bench 3', risk_level: 'High', description: 'Automated telemetry indicates PM10 levels exceeding 250 µg/m³ near active haul road.', actions: 'Activate mist sprayers and redirect water tankers.' },
      { id: 2, title: 'Optimal Slope Stability Verified', risk_level: 'Low', description: 'InSAR satellite sensors show zero millimeter displacement across Bench 4.', actions: 'Maintain normal extraction pace.' }
    ]
  };

  const activeData = data && data.kpis ? data : defaultData;
  const { kpis, recent_inspections, ai_insights, compliance_rules, mine } = activeData;

  const productionData = [
    { month: 'Apr', Target: 100000, Actual: 98000 },
    { month: 'May', Target: 110000, Actual: 106000 },
    { month: 'Jun', Target: 115000, Actual: 118000 },
    { month: 'Jul', Target: 120000, Actual: 112000 },
    { month: 'Aug', Target: 120000, Actual: 119500 },
    { month: 'Sep (Current)', Target: kpis.production_target || 120000, Actual: kpis.production_actual || 114500 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner based on Active Role */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Active Government Context: {role.toUpperCase()}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
            {role === 'supervisor' && 'Field Operations & Daily Inspection Portal'}
            {role === 'manager' && 'Mine Management & Production Executive Dashboard'}
            {role === 'regulator' && 'Directorate General of Mines Safety (DGMS) Portal'}
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Monitoring <strong className="text-slate-900 font-bold">{mine ? mine.name : 'Ramagundam OC-II'}</strong> ({mine ? mine.subsidiary : 'Singareni Collieries Company Limited'}) • Real-time Compliance Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('inspections')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm"
          >
            <Pickaxe className="w-4 h-4 text-amber-400" />
            + Log Inspection
          </button>
          <button
            onClick={() => onTabChange('ocr')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 flex items-center gap-2 transition"
          >
            <FileCheck className="w-4 h-4 text-blue-600" />
            Upload Report (OCR)
          </button>
        </div>
      </div>

      {role === 'manager' && <SectionStaffing />}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Score Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Compliance</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1 font-['Outfit']">{kpis.compliance_score}%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>4 of 5 Statutory Rules Compliant</span>
          </p>
        </div>

        {/* Safety Score Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mine Safety Index</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-1 font-['Outfit']">{kpis.safety_score}/100</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{kpis.open_incidents} Active Hazard Observations</span>
          </p>
        </div>

        {/* Workforce Attendance Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shift A Attendance</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-1 font-['Outfit']">
                {kpis.workforce_present}/{kpis.workforce_total}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>92% Present (Shift Health Cleared)</span>
          </p>
        </div>

        {/* Monthly Production Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-indigo-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coal Extraction</p>
              <h3 className="text-3xl font-bold text-indigo-700 mt-1 font-['Outfit']">
                {(kpis.production_actual / 1000).toFixed(1)}k <span className="text-xs text-slate-500 font-normal">Tons</span>
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target: {(kpis.production_target / 1000).toFixed(0)}k Tons (95.4%)</span>
          </p>
        </div>
      </div>

      {/* Main Visual Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production vs Target Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Coal Extraction Tonnage vs Statutory Target (MT)</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time tonnage extracted across active benches</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">FY 2026</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="Target" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictive Risk Feed */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">AI Risk Telemetry Feed</h3>
              </div>
              <button onClick={() => onTabChange('ai')} className="text-xs text-blue-600 hover:underline font-bold flex items-center">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {ai_insights && ai_insights.length > 0 ? (
                ai_insights.slice(0, 3).map((ai) => (
                  <div key={ai.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        ai.risk_level === 'Critical' || ai.risk_level === 'High'
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {ai.risk_level} Risk • {ai.confidence}% Conf.
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{ai.created_at}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{ai.title}</h4>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-2">{ai.recommendation}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No active AI risk alerts.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-center">
            <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
              ⚡ Predictive Risk Engine Active (Ministry AI Framework)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Geo Inspections & Statutory Compliance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Inspections Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Recent Geo-Tagged Inspections</h3>
            <button onClick={() => onTabChange('inspections')} className="text-xs text-blue-600 font-bold hover:underline">
              All Inspections &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recent_inspections && recent_inspections.length > 0 ? (
              recent_inspections.map((insp) => (
                <div key={insp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{insp.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        insp.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {insp.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      📍 {insp.location_name} • Inspector: {insp.inspector}
                    </p>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                    insp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {insp.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No recent inspections logged.</p>
            )}
          </div>
        </div>

        {/* Statutory Compliance Matrix */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Statutory Compliance Status (DGMS / MoEFCC)</h3>
            <button onClick={() => onTabChange('compliance')} className="text-xs text-blue-600 font-bold hover:underline">
              Calendar & Rules &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {compliance_rules && compliance_rules.length > 0 ? (
              compliance_rules.slice(0, 4).map((rule) => (
                <div key={rule.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-700">{rule.authority}</span>
                      <span className="text-xs font-bold text-slate-900">{rule.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">Due: {rule.due_date} • Category: {rule.category}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                    rule.status === 'Compliant'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rule.status === 'Warning'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rule.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No compliance items available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
