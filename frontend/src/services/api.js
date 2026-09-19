const API_BASE = '/api';
const TOKEN_KEY = 'coaltrack_token';
const USER_KEY = 'coaltrack_user';

function readStorage(key) {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
}

function writeStorage(key, value) {
  if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
}

function removeStorage(key) {
  if (typeof window !== 'undefined') window.localStorage.removeItem(key);
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = readStorage(TOKEN_KEY);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (error) {
    throw new Error('Cannot connect to the CoalTrack server. Check that the backend is running.');
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 401 && path !== '/login') {
      clearAuthSession();
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new Event('coaltrack:unauthorized'));
      }
    }
    if (response.status >= 500 && !payload) {
      throw new Error('CoalTrack backend is unavailable. Start the project from its root folder with npm run dev.');
    }
    throw new Error(payload?.error || `Request failed with status ${response.status}`);
  }
  return payload;
}

function withMine(path, mineId) {
  return mineId ? `${path}?mine_id=${encodeURIComponent(mineId)}` : path;
}

export function getStoredUser() {
  const raw = readStorage(USER_KEY);
  if (!raw || !readStorage(TOKEN_KEY)) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  removeStorage(TOKEN_KEY);
  removeStorage(USER_KEY);
}

export async function loginUser(email, password) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  writeStorage(TOKEN_KEY, data.token);
  writeStorage(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function logoutUser() {
  try {
    await request('/logout', { method: 'POST' });
  } finally {
    clearAuthSession();
  }
}

export const fetchDashboard = (role, mineId) => request(withMine('/dashboard', mineId));
export const fetchMines = () => request('/mines');
export const fetchCompliance = mineId => request(withMine('/compliance', mineId));
export const fetchInspections = mineId => request(withMine('/inspections', mineId));
export const fetchAIInsights = mineId => request(withMine('/ai/insights', mineId));
export const fetchOCRHistory = () => request('/ocr/history');
export const fetchWorkforce = mineId => request(withMine('/workforce', mineId));
export const fetchGISZones = mineId => request(withMine('/gis', mineId));
export const fetchGrievances = mineId => request(withMine('/grievances', mineId));

export const createCompliance = ruleData => request('/compliance', {
  method: 'POST',
  body: JSON.stringify(ruleData)
});

export const createInspection = inspectionData => request('/inspections', {
  method: 'POST',
  body: JSON.stringify(inspectionData)
});

export const processOCR = ocrData => request('/ocr/process', {
  method: 'POST',
  body: JSON.stringify(ocrData)
});

export const createGrievance = grievanceData => request('/grievances', {
  method: 'POST',
  body: JSON.stringify(grievanceData)
});
