import React, { useState, useEffect } from 'react';
import { fetchCompliance, createCompliance } from '../services/api';
import { ShieldAlert, Calendar, Plus, CheckCircle, AlertTriangle, FileText, CheckSquare } from 'lucide-react';

export default function Compliance({ mineId }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterAuth, setFilterAuth] = useState('All');

  const [formData, setFormData] = useState({
    authority: 'DGMS',
    title: '',
    description: '',
    category: 'Safety',
    due_date: '2026-10-31',
    mine_id: mineId || 1
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCompliance(mineId);
      setRules(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [mineId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCompliance({ ...formData, mine_id: mineId || 1 });
    setShowModal(false);
    setFormData({
      authority: 'DGMS',
      title: '',
      description: '',
      category: 'Safety',
      due_date: '2026-10-31',
      mine_id: mineId || 1
    });
    loadData();
  };

  const safeRules = Array.isArray(rules) ? rules : [];
  const filteredRules = filterAuth === 'All'
    ? safeRules
    : safeRules.filter(r => r && r.authority === filterAuth);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Statutory Compliance Matrix & Audit Logs</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Regulatory Governance & Clearances</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Tracking Indian coal mining regulations: DGMS, Coal Mines Regulations 2017, MoEFCC, CPCB, & Labour Laws
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4 stroke-[3] text-amber-400" />
          Add Compliance Deadline
        </button>
      </div>

      {/* Authorities Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
        {['All', 'DGMS', 'MoEFCC', 'CPCB', 'Labour Dept', 'CCO'].map(auth => (
          <button
            key={auth}
            onClick={() => setFilterAuth(auth)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterAuth === auth
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {auth}
          </button>
        ))}
      </div>

      {/* Main Compliance Grid & Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Table / Cards */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs font-medium">Loading statutory compliance records...</div>
          ) : (
            filteredRules.map((rule) => (
              <div key={rule.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold uppercase">
                      {rule.authority}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      Category: {rule.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">{rule.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{rule.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium pt-1">
                    <span className="flex items-center gap-1 text-amber-700 font-bold">
                      <Calendar className="w-3.5 h-3.5" /> Due Date: {rule.due_date}
                    </span>
                    <span>Mine: {rule.mine_name || 'Korba Opencast Pit B'}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-3 py-1 rounded-xl text-xs font-extrabold uppercase ${
                    rule.status === 'Compliant'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : rule.status === 'Warning'
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {rule.status}
                  </span>
                  <p className="text-[11px] font-bold text-slate-600 mt-2">Score: {rule.score}/100</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Regulatory Calendar & Audit Dossier Sidebar */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit']">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3>Statutory Submission Calendar</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase">Sept 25, 2026 • CPCB Return</span>
              <p className="text-xs font-bold text-slate-900">Mine Effluent Water pH Check</p>
              <p className="text-[11px] text-slate-600 font-medium">Quarterly submission to Central Pollution Control Board</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Sept 30, 2026 • DGMS CMR 2017</span>
              <p className="text-xs font-bold text-slate-900">Highwall Slope Stability Radar Audit</p>
              <p className="text-[11px] text-slate-600 font-medium">Regulation 160 compliance certification</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Oct 15, 2026 • MoEFCC PARIVESH</span>
              <p className="text-xs font-bold text-slate-900">Ambient PM10 Dust Suppression Return</p>
              <p className="text-[11px] text-slate-600 font-medium">Air quality monitoring log submission</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckSquare className="w-4 h-4 text-emerald-700" />
              <span>Digital Audit Dossier Ready</span>
            </div>
            <p className="text-[11px] text-slate-700 font-medium">
              One-click consolidated dossier generation available for DGMS government inspectors.
            </p>
            <button className="w-full mt-1 py-2 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition shadow-xs">
              Download DGMS Dossier (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Add Compliance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Add Statutory Compliance Rule</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900 font-bold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Authority</label>
                  <select
                    value={formData.authority}
                    onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="DGMS">DGMS (Directorate General of Mines Safety)</option>
                    <option value="MoEFCC">MoEFCC (Ministry of Environment)</option>
                    <option value="CPCB">CPCB (Pollution Control Board)</option>
                    <option value="Labour Dept">Labour Department</option>
                    <option value="CCO">CCO (Coal Controller Org)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Production">Production</option>
                    <option value="Labour">Labour</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Compliance Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly Ventilation & Gas Monitoring Audit"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / Statutory Clause</label>
                <textarea
                  rows="2"
                  placeholder="Reference regulation number and mandatory documentation..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Statutory Submission Due Date</label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  Save Compliance Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
