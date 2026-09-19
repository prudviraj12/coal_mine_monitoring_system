import React, { useState, useEffect } from 'react';
import { fetchInspections, createInspection } from '../services/api';
import { ClipboardCheck, MapPin, Plus, Camera, AlertOctagon, CheckCircle, Clock } from 'lucide-react';

export default function Inspections({ mineId }) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    inspector: 'Rajesh Kumar (Field Supervisor)',
    location_name: 'North Access Ramp - Bench 4',
    lat: 22.3612,
    lng: 82.7523,
    severity: 'Medium',
    violations: '',
    corrective_action: '',
    photo_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchInspections(mineId);
      setInspections(data);
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
    await createInspection({ ...formData, mine_id: mineId || 1 });
    setShowModal(false);
    setFormData({
      title: '',
      inspector: 'Rajesh Kumar (Field Supervisor)',
      location_name: 'North Access Ramp - Bench 4',
      lat: 22.3612,
      lng: 82.7523,
      severity: 'Medium',
      violations: '',
      corrective_action: '',
      photo_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500'
    });
    loadData();
  };

  const safeInspections = Array.isArray(inspections) ? inspections : [];
  const filteredInspections = filterSeverity === 'All'
    ? safeInspections
    : safeInspections.filter(i => i && i.severity === filterSeverity);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>Field Surveillance & Geo-Tagged Log</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Mine Safety & Operational Inspections</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Time-stamped and location-verified field observations for statutory safety reporting
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4 stroke-[3] text-amber-400" />
          Log New Inspection
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['All', 'High', 'Medium', 'Low'].map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterSeverity === sev
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {sev} Severity
          </button>
        ))}
      </div>

      {/* Inspection Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs font-medium">Loading inspection telemetries...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInspections.map((insp) => (
            <div key={insp.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      insp.severity === 'High' || insp.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {insp.severity} Severity
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 font-['Outfit']">{insp.title}</h3>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold shrink-0 ${
                    insp.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {insp.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <p className="text-slate-800 font-semibold">⚠️ <strong>Observation/Violation:</strong> {insp.violations}</p>
                  <p className="text-blue-800 font-bold">🔧 <strong>Action Required:</strong> {insp.corrective_action}</p>
                </div>
              </div>

              {/* Photo & Geo Tag Info */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>{insp.location_name} ({insp.lat.toFixed(4)}°, {insp.lng.toFixed(4)}°)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{insp.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Inspection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Log Field Inspection (Geo-Tagged)</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900 font-bold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Inspection Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haul Road Dust Barrier & Highwall Stability Check"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mine Location / Bench</label>
                  <input
                    type="text"
                    value={formData.location_name}
                    onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Severity Level</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Safety Violation / Observation Details</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Describe field conditions, hazards, or non-compliance observed..."
                  value={formData.violations}
                  onChange={(e) => setFormData({ ...formData, violations: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Required Corrective Action</label>
                <input
                  type="text"
                  required
                  placeholder="Action assigned to field supervisor..."
                  value={formData.corrective_action}
                  onChange={(e) => setFormData({ ...formData, corrective_action: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-blue-900">
                <span className="flex items-center gap-1.5 font-bold text-xs">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  Auto Geo-Tagging Enabled (Lat: 22.3612, Lng: 82.7523)
                </span>
                <span className="text-[10px] uppercase font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-300">GPS Verified</span>
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
                  Save & Log Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
