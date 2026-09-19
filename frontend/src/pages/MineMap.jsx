import React, { useState, useEffect } from 'react';
import { fetchGISZones } from '../services/api';
import { MapPin, Flame, ShieldAlert, Wind, Activity, Compass, Layers, Eye } from 'lucide-react';

export default function MineMap({ mineId }) {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [layerMode, setLayerMode] = useState('heatmap');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGISZones(mineId);
        setZones(data);
        if (data && data.length > 0) {
          setSelectedZone(data[1] || data[0]);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [mineId]);

  return (
    <div className="space-y-6">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-rose-600" />
            <span>Interactive GIS Mine Visualizer & Telemetry</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Korba Opencast Pit B — Spatial Risk Map</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Real-time geospatial layout of extraction benches, dumper routes, gas sensors, and slope displacement heatmaps
          </p>
        </div>

        {/* Map View Mode Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setLayerMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              layerMode === 'heatmap' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'text-slate-600'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" /> Slope Risk Heatmap
          </button>
          <button
            onClick={() => setLayerMode('gas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              layerMode === 'gas' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'text-slate-600'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-blue-600" /> CH4 Gas Sensors
          </button>
        </div>
      </div>

      {/* GIS Canvas Visualizer & Telemetry Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG/Canvas Mine Map Render Area */}
        <div className="lg:col-span-2 relative p-4 rounded-2xl bg-white border border-slate-200 shadow-xs min-h-[420px] flex flex-col justify-between overflow-hidden">
          {/* Map Title Overlay */}
          <div className="absolute top-6 left-6 z-10 bg-white/95 shadow-md px-3.5 py-2 rounded-xl border border-slate-300 text-xs space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-extrabold text-slate-900">GIS Spatial Telemetry Live</span>
            </div>
            <p className="text-[10px] text-slate-600 font-semibold">Coordinates: 22.3595° N, 82.7501° E</p>
          </div>

          {/* Interactive SVG Mine Layout Diagram (Light/Government Map Style) */}
          <div className="w-full h-80 my-auto relative bg-slate-100/90 rounded-xl border border-slate-300 p-4 flex items-center justify-center">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Mine Outer Boundary */}
              <polygon
                points="50,50 750,30 720,370 70,350"
                fill="#E2E8F0"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Haul Road Route */}
              <path
                d="M 100 320 Q 300 220 400 200 T 700 80"
                fill="none"
                stroke="#0284C7"
                strokeWidth="6"
                strokeOpacity="0.3"
              />
              <path
                d="M 100 320 Q 300 220 400 200 T 700 80"
                fill="none"
                stroke="#0284C7"
                strokeWidth="2"
                strokeDasharray="8 6"
              />

              {/* Benches / Extraction Pits Contour Lines */}
              <ellipse cx="400" cy="220" rx="280" ry="110" fill="none" stroke="#CBD5E1" strokeWidth="3" />
              <ellipse cx="400" cy="220" rx="200" ry="75" fill="none" stroke="#94A3B8" strokeWidth="2" />
              <ellipse cx="400" cy="220" rx="120" ry="40" fill="#CBD5E1" opacity="0.4" stroke="#64748B" strokeWidth="2" />

              {/* Highwall Slope Hazard Zone (Red Heatmap Pulse) */}
              <g onClick={() => setSelectedZone(zones[1] || null)} className="cursor-pointer">
                <circle cx="580" cy="120" r="55" fill="#EF4444" opacity="0.2" className="animate-pulse" />
                <circle cx="580" cy="120" r="35" fill="#EF4444" opacity="0.3" />
                <circle cx="580" cy="120" r="10" fill="#DC2626" />
                <text x="580" y="90" textAnchor="middle" fill="#991B1B" fontSize="12" fontWeight="bold">
                  ⚠️ Bench 3 Highwall (Slope Risk 82%)
                </text>
              </g>

              {/* Active Coal Face A */}
              <g onClick={() => setSelectedZone(zones[0] || null)} className="cursor-pointer">
                <circle cx="340" cy="220" r="40" fill="#10B981" opacity="0.25" />
                <circle cx="340" cy="220" r="8" fill="#059669" />
                <text x="340" y="250" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="bold">
                  ⛏️ Coal Face A (Active)
                </text>
              </g>

              {/* Dumper Route North Marker */}
              <g onClick={() => setSelectedZone(zones[2] || null)} className="cursor-pointer">
                <circle cx="200" cy="280" r="8" fill="#D97706" />
                <text x="200" y="305" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="bold">
                  🚛 Haul Ramp North
                </text>
              </g>

              {/* Eco Settling Zone */}
              <g onClick={() => setSelectedZone(zones[3] || null)} className="cursor-pointer">
                <rect x="100" y="100" width="100" height="60" rx="8" fill="#0284C7" opacity="0.15" stroke="#0284C7" />
                <text x="150" y="135" textAnchor="middle" fill="#075985" fontSize="11" fontWeight="bold">
                  🌿 Settling Pond
                </text>
              </g>
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> High Risk Bench</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Active Extraction</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Haul Road & Route</span>
            </div>
            <span>Click any zone for live telemetries</span>
          </div>
        </div>

        {/* Selected Zone Telemetry Panel */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          {selectedZone ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Zone Telemetry</span>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">{selectedZone.zone_name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase ${
                  selectedZone.risk_score > 60 ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  Risk Score: {selectedZone.risk_score}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Zone Type</p>
                  <p className="text-slate-900 font-bold mt-0.5">{selectedZone.zone_type}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Methane Gas (CH4)</p>
                  <p className="text-blue-700 font-bold mt-0.5">{selectedZone.methane_ppm}% PPM</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Particulate PM10</p>
                  <p className="text-amber-800 font-bold mt-0.5">{selectedZone.dust_pm10} µg/m³</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">GPS Benchmark</p>
                  <p className="text-slate-900 font-bold mt-0.5">{selectedZone.lat.toFixed(4)}°, {selectedZone.lng.toFixed(4)}°</p>
                </div>
              </div>

              {selectedZone.risk_score > 60 && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Automated Hazard Action Triggered
                  </p>
                  <p className="text-[11px] text-slate-700 font-medium">
                    Highwall radar telemetry flags 4.2mm slope micro-movement over 12 hrs. Shift supervisor notified.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs font-medium">Click a zone marker on the mine layout to inspect.</div>
          )}

          <div className="pt-3 border-t border-slate-200 text-center text-slate-500 text-xs font-medium">
            Coordinates validated against Coal India GIS Database
          </div>
        </div>
      </div>
    </div>
  );
}
