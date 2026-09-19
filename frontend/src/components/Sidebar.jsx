import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  ShieldAlert,
  MapPin,
  BrainCircuit,
  FileScan,
  Users,
  MessageSquareWarning,
  HardHat,
  Pickaxe,
  ShieldCheck,
  Shield
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentRole }) {
  // Worker-specific navigation items (Simple & clear labels for mine workers)
  const workerNavItems = [
    { id: 'worker_dashboard', label: 'My Work & Salary', icon: HardHat, badge: 'My Pay' },
    { id: 'gis', label: 'Safety Mine Map', icon: MapPin, badge: 'Map' },
    { id: 'workforce', label: 'Shift Schedule & Duty', icon: Users, badge: 'My Shift' },
    { id: 'grievances', label: 'Report Safety Problem', icon: MessageSquareWarning }
  ];

  // Field Supervisor-specific navigation items
  const supervisorNavItems = [
    { id: 'supervisor_dashboard', label: 'Shift Overview', icon: Pickaxe, badge: 'Daily' },
    { id: 'gis', label: 'Safety Mine Map', icon: MapPin, badge: 'Map' },
    { id: 'inspections', label: 'Safety Inspections', icon: ClipboardCheck, badge: 'Check' },
    { id: 'workforce', label: 'Worker Attendance', icon: Users },
    { id: 'grievances', label: 'Safety Complaints', icon: MessageSquareWarning }
  ];

  // Government Regulator (DGMS)-specific navigation items
  const regulatorNavItems = [
    { id: 'regulator_dashboard', label: 'Audit Dashboard', icon: ShieldCheck, badge: 'Audit' },
    { id: 'compliance', label: 'Safety Regulations', icon: ShieldAlert, badge: 'Rules' },
    { id: 'gis', label: 'Safety Mine Map', icon: MapPin, badge: 'Map' },
    { id: 'ai', label: 'AI Risk Reports', icon: BrainCircuit, badge: 'AI Risk' },
    { id: 'ocr', label: 'Document Scanner', icon: FileScan, badge: 'Scan' }
  ];

  // Mine Manager navigation items
  const managerNavItems = [
    { id: 'dashboard', label: 'Main Overview', icon: LayoutDashboard, badge: 'Live' },
    { id: 'inspections', label: 'Safety Inspections', icon: ClipboardCheck },
    { id: 'compliance', label: 'Safety Regulations', icon: ShieldAlert },
    { id: 'gis', label: 'Safety Mine Map', icon: MapPin },
    { id: 'ai', label: 'AI Risk Reports', icon: BrainCircuit },
    { id: 'ocr', label: 'Document Scanner', icon: FileScan },
    { id: 'workforce', label: 'Workforce & Shifts', icon: Users },
    { id: 'grievances', label: 'Worker Complaints', icon: MessageSquareWarning }
  ];

  let navItems = managerNavItems;
  let portalTitle = 'Mine Manager Portal';

  if (currentRole === 'worker') {
    navItems = workerNavItems;
    portalTitle = 'Mine Worker Portal';
  } else if (currentRole === 'supervisor') {
    navItems = supervisorNavItems;
    portalTitle = 'Supervisor Portal';
  } else if (currentRole === 'regulator') {
    navItems = regulatorNavItems;
    portalTitle = 'Government Portal';
  }

  return (
    <>
      {/* Mobile Horizontal Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 p-2 overflow-x-auto flex gap-2 shrink-0 sticky top-[61px] z-40 shadow-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-61px)] shadow-xs">
        <div className="p-4 space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            {portalTitle}
          </p>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                    isActive ? 'bg-amber-400 text-black' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Official Footer Banner */}
        <div className="p-4 m-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-100">National Mine Portal</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Simple & Safe Digital Portal for Mine Workers & Officers.
          </p>
        </div>
      </aside>
    </>
  );
}
