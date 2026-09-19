import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';

const values = new Map();
globalThis.window = {
  localStorage: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  }
};

const api = await import('../src/services/api.js');

beforeEach(() => {
  values.clear();
  globalThis.fetch = undefined;
});

test('login stores the signed token and user session', async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/login');
    assert.equal(options.method, 'POST');
    return new Response(JSON.stringify({
      token: 'header.payload.signature',
      user: { id: 1, role: 'supervisor', mine_id: 1 }
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  await api.loginUser('supervisor@coaltrack.gov.in', 'sup123');
  assert.equal(values.get('coaltrack_token'), 'header.payload.signature');
  assert.equal(api.getStoredUser().role, 'supervisor');
});

test('authenticated requests include the token and selected mine', async () => {
  values.set('coaltrack_token', 'signed-token');
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/dashboard?mine_id=2');
    assert.equal(options.headers.get('authorization'), 'Bearer signed-token');
    return new Response(JSON.stringify({ mine: { id: 2 } }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  };

  const dashboard = await api.fetchDashboard('regulator', 2);
  assert.equal(dashboard.mine.id, 2);
});

test('server errors are surfaced instead of returning fake successful data', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Validation failed' }), {
    status: 400,
    headers: { 'content-type': 'application/json' }
  });

  await assert.rejects(
    () => api.createGrievance({}),
    error => error.message === 'Validation failed'
  );
});

test('unauthorized responses clear stale sessions', async () => {
  values.set('coaltrack_token', 'expired-token');
  values.set('coaltrack_user', JSON.stringify({ id: 1 }));
  globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
    status: 401,
    headers: { 'content-type': 'application/json' }
  });

  await assert.rejects(() => api.fetchMines());
  assert.equal(api.getStoredUser(), null);
});
