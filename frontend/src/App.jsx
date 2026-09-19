import React, { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { fetchDashboard, fetchMines, getStoredUser, logoutUser } from './services/api';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inspections = lazy(() => import('./pages/Inspections'));
const Compliance = lazy(() => import('./pages/Compliance'));
const MineMap = lazy(() => import('./pages/MineMap'));
const AIRisk = lazy(() => import('./pages/AIRisk'));
const OCRScanner = lazy(() => import('./pages/OCRScanner'));
const Workforce = lazy(() => import('./pages/Workforce'));
const Grievances = lazy(() => import('./pages/Grievances'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard'));
const SupervisorDashboard = lazy(() => import('./pages/SupervisorDashboard'));
const RegulatorDashboard = lazy(() => import('./pages/RegulatorDashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

const pageFallback = (
  <div className="p-8 text-center text-slate-500 text-xs font-medium">Loading CoalTrack module...</div>
);

function dashboardTabForRole(role) {
  if (role === 'worker') return 'worker_dashboard';
  if (role === 'supervisor') return 'supervisor_dashboard';
  if (role === 'regulator') return 'regulator_dashboard';
  return 'dashboard';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [currentRole, setCurrentRole] = useState(() => getStoredUser()?.role || 'supervisor');
  const [activeTab, setActiveTab] = useState(() => dashboardTabForRole(getStoredUser()?.role));
  const [activeMine, setActiveMine] = useState(() => getStoredUser()?.mine_id || 1);
  const [mines, setMines] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setDashboardData(null);
      setMines([]);
    };
    window.addEventListener('coaltrack:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('coaltrack:unauthorized', handleUnauthorized);
  }, []);

  // Load mines & dashboard telemetries
  useEffect(() => {
    if (!currentUser) return;
    async function loadMines() {
      try {
        const data = await fetchMines();
        setMines(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadMines();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    async function loadDashboard() {
      setLoading(true);
      try {
        const data = await fetchDashboard(currentRole, activeMine);
        setDashboardData(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    loadDashboard();
  }, [currentRole, activeMine, currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveTab(dashboardTabForRole(user.role));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      setCurrentUser(null);
      setDashboardData(null);
      setMines([]);
    }
  };

  // Render Login Screen if not authenticated
  if (!currentUser) {
    return <Suspense fallback={pageFallback}><LoginPage onLoginSuccess={handleLoginSuccess} /></Suspense>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Inter',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeMine={activeMine}
        setActiveMine={setActiveMine}
        mines={mines}
        onLogout={handleLogout}
        user={currentUser}
      />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentRole={currentRole} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto">
          <Suspense fallback={pageFallback}>
          {/* Worker Specific View */}
          {activeTab === 'worker_dashboard' && <WorkerDashboard user={currentUser} />}

          {/* Supervisor Specific View */}
          {activeTab === 'supervisor_dashboard' && (
            <SupervisorDashboard data={dashboardData} onTabChange={setActiveTab} />
          )}

          {/* Government Regulator Specific View */}
          {activeTab === 'regulator_dashboard' && (
            <RegulatorDashboard data={dashboardData} onTabChange={setActiveTab} />
          )}

          {/* Mine Manager Executive View */}
          {activeTab === 'dashboard' && currentRole === 'manager' && (
            <Dashboard data={dashboardData} role={currentRole} onTabChange={setActiveTab} />
          )}

          {/* Shared / Role-Allowed Modules */}
          {activeTab === 'gis' && <MineMap mineId={activeMine} />}
          {activeTab === 'inspections' && currentRole !== 'worker' && <Inspections mineId={activeMine} />}
          {activeTab === 'compliance' && currentRole !== 'worker' && <Compliance mineId={activeMine} />}
          {activeTab === 'ai' && currentRole !== 'worker' && <AIRisk mineId={activeMine} />}
          {activeTab === 'ocr' && currentRole !== 'worker' && <OCRScanner />}
          {activeTab === 'workforce' && <Workforce mineId={activeMine} />}
          {activeTab === 'grievances' && <Grievances mineId={activeMine} />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
