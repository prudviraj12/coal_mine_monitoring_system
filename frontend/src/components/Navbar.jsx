import React from 'react';
import { Pickaxe, ShieldCheck, UserCheck, Building2, Bell, Radio, LogOut } from 'lucide-react';

export default function Navbar({ currentRole, setCurrentRole, activeMine, setActiveMine, mines, onLogout, user }) {
  const roles = [
    { id: 'supervisor', label: 'Field Supervisor View', icon: Pickaxe, color: 'text-amber-800 bg-amber-50 border-amber-300' },
    { id: 'manager', label: 'Mine Manager View', icon: Building2, color: 'text-blue-800 bg-blue-50 border-blue-300' },
    { id: 'regulator', label: 'Government Regulator (DGMS)', icon: ShieldCheck, color: 'text-emerald-800 bg-emerald-50 border-emerald-300' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xs">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-slate-900 text-amber-400 shadow-md">
          <Pickaxe className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">CoalTrack</h1>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
              Mine Safety Portal
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium hidden sm:block">Simple safety and work information for every mine worker</p>
        </div>
      </div>

      {/* Center Controls: Mine Selection & Role Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Mine Switcher */}
        <select
          value={activeMine}
          onChange={(e) => setActiveMine(Number(e.target.value))}
          className="bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-600 shadow-xs"
        >
          {mines && mines.length > 0 ? (
            mines.map(m => (
              <option key={m.id} value={m.id}>📍 {m.name} ({m.subsidiary})</option>
            ))
          ) : (
            <option value={1}>📍 Korba Opencast Pit B (SECL)</option>
          )}
        </select>

        {/* Role Portal Indicator (Locked per Logged-in User) */}
        {currentRole === 'worker' && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-300 text-xs font-extrabold">
            <UserCheck className="w-4 h-4 text-purple-700" />
            <span>Mine Worker Portal</span>
          </div>
        )}
        {currentRole === 'supervisor' && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-extrabold">
            <Pickaxe className="w-4 h-4 text-amber-700" />
            <span>Supervisor Portal</span>
          </div>
        )}
        {currentRole === 'regulator' && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Government Inspector Portal</span>
          </div>
        )}
        {currentRole === 'manager' && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-300 text-xs font-extrabold">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Mine Manager Portal</span>
          </div>
        )}
        {currentRole === 'admin' && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>System Administration</span>
          </div>
        )}
      </div>

      {/* Right Side Status & User Info */}
      <div className="flex items-center gap-4">
        {/* Live Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Radio className="w-3 h-3 text-emerald-600" />
          <span>System connected</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white p-0.5 shadow-xs">
              <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-amber-400 text-xs">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : (currentRole === 'supervisor' ? 'RK' : currentRole === 'manager' ? 'AS' : 'VS')}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800">
                {user?.name || (currentRole === 'supervisor' ? 'Rajesh Kumar' : currentRole === 'manager' ? 'Anil Sharma' : currentRole === 'admin' ? 'System Administrator' : 'Dr. V. K. Singh')}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{currentRole}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Logout of Portal"
            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition font-bold text-xs flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

