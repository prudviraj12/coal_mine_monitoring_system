import React, { useState, useEffect } from 'react';
import { fetchGrievances, createGrievance } from '../services/api';
import { MessageSquareWarning, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function Grievances({ mineId }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    submitted_by: 'Ramesh Yadav (Miner)',
    category: 'Workplace Safety',
    mine_id: mineId || 1,
    priority: 'High'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchGrievances(mineId);
      setGrievances(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [mineId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createGrievance({ ...formData, mine_id: mineId || 1 });
    setShowModal(false);
    setFormData({
      title: '',
      submitted_by: 'Ramesh Yadav (Miner)',
      category: 'Workplace Safety',
      mine_id: mineId || 1,
      priority: 'High'
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquareWarning className="w-4 h-4 text-rose-600" />
            <span>Worker Safety & Grievance Redressal</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Mine Worker Grievance Portal</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Transparent grievance logging, safety escalation, and digital approval tracking for mine personnel
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4 stroke-[3] text-amber-400" />
          Submit Grievance
        </button>
      </div>

      {/* Grievance Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs font-medium">Loading grievance records...</div>
        ) : (
          (Array.isArray(grievances) ? grievances : []).map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    item.priority === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {item.priority} Priority
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                    Category: {item.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">{item.title}</h3>
                <p className="text-xs text-slate-600 font-medium">Submitted by: <strong className="text-slate-900">{item.submitted_by}</strong> • Date: {item.date}</p>
              </div>

              <div className="text-right shrink-0 space-y-2">
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                  item.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {item.status}
                </span>
                <div>
                  <button className="text-xs px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold border border-slate-300 transition">
                    Resolve & Sign-off &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Grievance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Submit Worker Grievance</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900 font-bold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Grievance Subject / Issue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dust suppression water tanker delay on Bench 2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-600"
                  >
                    <option value="Workplace Safety">Workplace Safety</option>
                    <option value="Infrastructure">Infrastructure & Lighting</option>
                    <option value="Equipment Defects">Equipment Defects</option>
                    <option value="Contractor Dispute">Contractor Dispute</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-600"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Submitted By (Worker / Supervisor)</label>
                <input
                  type="text"
                  required
                  value={formData.submitted_by}
                  onChange={(e) => setFormData({ ...formData, submitted_by: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-600"
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
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Submit Grievance Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
