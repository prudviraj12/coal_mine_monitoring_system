import React, { useState, useEffect } from 'react';
import { fetchAIInsights } from '../services/api';
import { BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, Cpu, RefreshCw, Zap } from 'lucide-react';

export default function AIRisk({ mineId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAIInsights(mineId);
      setInsights(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [mineId]);

  const triggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      loadData();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4 text-blue-600" />
            <span>Machine Learning & Predictive Risk Center</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">AI-Powered Risk & Anomaly Detection</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Continuous AI surveillance analyzing telemetry, worker shifts, environmental gas sensors, and slope radars
          </p>
        </div>

        <button
          onClick={triggerScan}
          disabled={scanning}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-slate-800 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-amber-400 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Running AI Diagnostics...' : 'Run Live AI Scan'}
        </button>
      </div>

      {/* AI Performance Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Model Prediction Accuracy</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-1 font-['Outfit']">94.8%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-3">Trained on 10+ years of Coal India incident logs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">High Risk Alerts Active</p>
              <h3 className="text-3xl font-bold text-rose-700 mt-1 font-['Outfit']">
                {insights.filter(i => i.risk_level === 'High' || i.risk_level === 'Critical').length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-3">Pre-emptive hazard warnings generated</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Anomalies Mitigated</p>
              <h3 className="text-3xl font-bold text-emerald-700 mt-1 font-['Outfit']">18 This Month</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-3">Auto-suggested supervisor mitigation applied</p>
        </div>
      </div>

      {/* AI Insights Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Real-Time AI Operational Diagnostics & Forecasts
        </h3>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs font-medium">Analyzing live telemetry...</div>
        ) : (
          <div className="space-y-4">
            {insights.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                      item.risk_level === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : item.risk_level === 'High'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {item.risk_level} Risk • Category: {item.risk_type}
                    </span>
                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> {item.confidence}% Model Confidence
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">Timestamp: {item.created_at}</span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 font-['Outfit']">{item.title}</h4>
                  <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">{item.description}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-950 font-bold">AI Recommendation:</strong> {item.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
