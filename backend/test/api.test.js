const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'coaltrack-api-'));
process.env.COALTRACK_DB_PATH = path.join(testDirectory, 'coaltrack.test.sqlite');
process.env.COALTRACK_JWT_SECRET = 'test-only-secret';

const app = require('../server');
const db = require('../db');

let server;
let baseUrl;
const tokens = {};

async function api(pathname, { token, body, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  if (token) headers.set('authorization', `Bearer ${token}`);
  if (body !== undefined) headers.set('content-type', 'application/json');
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;
  return { response, payload };
}

async function login(email, password) {
  const { response, payload } = await api('/api/login', {
    method: 'POST',
    body: { email, password }
  });
  assert.equal(response.status, 200);
  assert.match(payload.token, /^[^.]+\.[^.]+\.[^.]+$/);
  return payload.token;
}

before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
  tokens.supervisor = await login('supervisor@coaltrack.gov.in', 'sup123');
  tokens.manager = await login('manager@coaltrack.gov.in', 'man123');
  tokens.regulator = await login('regulator@coaltrack.gov.in', 'reg123');
  tokens.worker = await login('worker@coaltrack.gov.in', 'work123');
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
  db.close();
  fs.rmSync(testDirectory, { recursive: true, force: true });
});

test('health endpoint is public', async () => {
  const { response, payload } = await api('/api/health');
  assert.equal(response.status, 200);
  assert.equal(payload.status, 'OK');
});

test('authentication rejects missing, wrong, and unknown credentials', async () => {
  let result = await api('/api/login', { method: 'POST', body: { email: 'supervisor@coaltrack.gov.in' } });
  assert.equal(result.response.status, 400);
  assert.deepEqual(result.payload.missing_fields, ['password']);

  result = await api('/api/login', { method: 'POST', body: { email: 'supervisor@coaltrack.gov.in', password: 'wrong' } });
  assert.equal(result.response.status, 401);

  result = await api('/api/login', { method: 'POST', body: { email: 'attacker-manager@example.com', password: 'x' } });
  assert.equal(result.response.status, 401);
});

test('protected data requires a valid token', async () => {
  const { response, payload } = await api('/api/compliance');
  assert.equal(response.status, 401);
  assert.equal(payload.error, 'Authentication required');
});

test('role authorization prevents workers from creating compliance records', async () => {
  const { response } = await api('/api/compliance', {
    method: 'POST',
    token: tokens.worker,
    body: { authority: 'DGMS', title: 'Test', category: 'Safety', due_date: '2026-12-01' }
  });
  assert.equal(response.status, 403);
});

test('dashboard metrics and records are scoped to the selected mine', async () => {
  const mine1 = await api('/api/dashboard?mine_id=1', { token: tokens.regulator });
  const mine2 = await api('/api/dashboard?mine_id=2', { token: tokens.regulator });
  assert.equal(mine1.response.status, 200);
  assert.equal(mine2.response.status, 200);
  assert.equal(mine1.payload.mine.id, 1);
  assert.equal(mine2.payload.mine.id, 2);
  assert.equal(mine1.payload.kpis.workforce_total, 4);
  assert.equal(mine2.payload.kpis.workforce_total, 1);
  assert.ok(mine1.payload.compliance_rules.every(record => record.mine_id === 1));
  assert.ok(mine2.payload.recent_inspections.every(record => record.mine_id === 2));
});

test('non-regulators cannot escape their assigned mine using a query parameter', async () => {
  const { response, payload } = await api('/api/dashboard?mine_id=2', { token: tokens.manager });
  assert.equal(response.status, 200);
  assert.equal(payload.mine.id, 1);
});

test('manager sees one supervisor and a worker count for every active work section', async () => {
  const { response, payload } = await api('/api/section-staffing', { token: tokens.manager });
  assert.equal(response.status, 200);
  assert.equal(payload.mine_name, 'Ramagundam OC-II');
  assert.equal(payload.sections.length, 9);
  assert.ok(payload.sections.every(section => section.supervisor_name));
  assert.ok(payload.sections.every(section => section.worker_count === 3));
});

test('invalid create requests return structured HTTP 400 errors', async () => {
  const cases = [
    ['/api/compliance', tokens.manager],
    ['/api/inspections', tokens.supervisor],
    ['/api/grievances', tokens.worker]
  ];
  for (const [pathname, token] of cases) {
    const { response, payload } = await api(pathname, { method: 'POST', token, body: {} });
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('content-type').includes('application/json'), true);
    assert.equal(payload.error, 'Validation failed');
  }
});

test('read endpoints and specification-compatible aliases return data', async () => {
  const checks = [
    ['/api/mines', tokens.regulator],
    ['/api/mine-locations', tokens.regulator],
    ['/api/inspection', tokens.regulator],
    ['/api/ocr-history', tokens.regulator],
    ['/api/risk-zones?mine_id=1', tokens.regulator],
    ['/api/inspection-map?mine_id=1', tokens.regulator],
    ['/api/workforce?mine_id=1', tokens.regulator],
    ['/api/grievances?mine_id=1', tokens.regulator]
  ];
  for (const [pathname, token] of checks) {
    const { response } = await api(pathname, { token });
    assert.equal(response.status, 200, pathname);
  }
});
