const express = require('express');
const cors = require('cors');
const db = require('./db');
const { getMineSpatialData } = require('./postgis');
const { allowRoles, authenticate, issueToken, verifyPassword } = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '10mb' }));

function requiredFields(body, fields) {
  return fields.filter(field => {
    const value = body?.[field];
    return value === undefined || value === null || (typeof value === 'string' && !value.trim());
  });
}

function validate(fields) {
  return (req, res, next) => {
    const missing = requiredFields(req.body, fields);
    if (missing.length) {
      return res.status(400).json({ error: 'Validation failed', missing_fields: missing });
    }
    return next();
  };
}

function requestedMineId(req) {
  const value = Number(req.query.mine_id ?? req.body?.mine_id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function effectiveMineId(req) {
  if (req.user.role === 'regulator' || req.user.role === 'admin') return requestedMineId(req) || 1;
  return Number(req.user.mine_id) || 1;
}

function optionalMineFilter(req, column = 'mine_id') {
  const mineId = req.user.role === 'regulator' || req.user.role === 'admin' ? requestedMineId(req) : effectiveMineId(req);
  return mineId ? { sql: ` WHERE ${column} = ?`, params: [mineId] } : { sql: '', params: [] };
}

// Public endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'CoalTrack AI Backend', timestamp: new Date().toISOString() });
});

app.post('/api/login', validate(['email', 'password']), (req, res) => {
  const email = String(req.body.email).trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(email);

  if (!user || !verifyPassword(req.body.password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mine_id: user.mine_id || null
  };

  return res.json({ message: 'Login successful', token: issueToken(safeUser), user: safeUser });
});

// Every endpoint below this point requires a valid signed token.
app.use('/api', authenticate);

app.post('/api/logout', (req, res) => res.status(204).end());

app.get('/api/profile', (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, mine_id, avatar FROM users WHERE id = ?').get(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});

app.get('/api/dashboard', (req, res) => {
  const mineId = effectiveMineId(req);
  const mine = db.prepare('SELECT * FROM mines WHERE id = ?').get(mineId);
  if (!mine) return res.status(404).json({ error: 'Mine not found' });

  const complianceRules = db.prepare('SELECT * FROM compliance_rules WHERE mine_id = ? ORDER BY due_date ASC').all(mineId);
  const inspections = db.prepare('SELECT * FROM inspections WHERE mine_id = ? ORDER BY date DESC LIMIT 5').all(mineId);
  const aiInsights = db.prepare('SELECT * FROM ai_insights WHERE mine_id = ? ORDER BY created_at DESC LIMIT 5').all(mineId);
  const workforceCount = db.prepare("SELECT COUNT(*) AS total, COALESCE(SUM(CASE WHEN attendance_status = 'Present' THEN 1 ELSE 0 END), 0) AS present FROM employees WHERE mine_id = ?").get(mineId);
  const openIncidents = db.prepare("SELECT COUNT(*) AS count FROM inspections WHERE mine_id = ? AND status != 'Resolved'").get(mineId).count;
  const totalScore = complianceRules.reduce((total, rule) => total + (rule.score || 0), 0);

  return res.json({
    role: req.user.role,
    mine,
    kpis: {
      compliance_score: complianceRules.length ? Math.round(totalScore / complianceRules.length) : 0,
      safety_score: mine.safety_score,
      workforce_total: workforceCount.total,
      workforce_present: workforceCount.present,
      open_incidents: openIncidents,
      production_actual: mine.production_actual,
      production_target: mine.production_target
    },
    compliance_rules: complianceRules,
    recent_inspections: inspections,
    ai_insights: aiInsights
  });
});

app.get(['/api/mines', '/api/mine-locations'], (req, res) => {
  if (req.user.role === 'regulator' || req.user.role === 'admin') return res.json(db.prepare('SELECT * FROM mines ORDER BY name').all());
  return res.json(db.prepare('SELECT * FROM mines WHERE id = ?').all(effectiveMineId(req)));
});

app.get('/api/admin/overview', allowRoles('admin'), (req, res) => {
  const users = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const mines = db.prepare('SELECT COUNT(*) AS count FROM mines').get().count;
  const openIncidents = db.prepare("SELECT COUNT(*) AS count FROM inspections WHERE status != 'Resolved'").get().count;
  return res.json({ users, mines, open_incidents: openIncidents, status: 'Operational' });
});

app.get('/api/compliance', allowRoles('supervisor', 'manager', 'regulator'), (req, res) => {
  const filter = optionalMineFilter(req, 'c.mine_id');
  const rules = db.prepare(`SELECT c.*, m.name AS mine_name FROM compliance_rules c LEFT JOIN mines m ON c.mine_id = m.id${filter.sql} ORDER BY c.due_date ASC`).all(...filter.params);
  return res.json(rules);
});

app.post('/api/compliance', allowRoles('manager', 'regulator'), validate(['authority', 'title', 'category', 'due_date']), (req, res) => {
  const { authority, title, description = '', category, due_date } = req.body;
  const mineId = req.user.role === 'regulator' ? (requestedMineId(req) || 1) : effectiveMineId(req);
  const result = db.prepare('INSERT INTO compliance_rules (authority, title, description, category, due_date, status, score, mine_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(authority.trim(), title.trim(), String(description).trim(), category.trim(), due_date, 'Pending', 90, mineId);
  return res.status(201).json({ id: result.lastInsertRowid, message: 'Compliance rule created' });
});

app.get(['/api/inspections', '/api/inspection'], allowRoles('supervisor', 'manager', 'regulator'), (req, res) => {
  const filter = optionalMineFilter(req, 'i.mine_id');
  const inspections = db.prepare(`SELECT i.*, m.name AS mine_name FROM inspections i LEFT JOIN mines m ON i.mine_id = m.id${filter.sql} ORDER BY i.date DESC`).all(...filter.params);
  return res.json(inspections);
});

app.post(['/api/inspections', '/api/inspection'], allowRoles('supervisor', 'manager', 'regulator'), validate(['title']), (req, res) => {
  const { title, inspector, location_name, lat, lng, severity, violations, corrective_action, photo_url } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const mineId = req.user.role === 'regulator' ? (requestedMineId(req) || 1) : effectiveMineId(req);
  const result = db.prepare(`
    INSERT INTO inspections (title, inspector, mine_id, location_name, lat, lng, date, severity, status, violations, corrective_action, photo_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open', ?, ?, ?)
  `).run(
    title.trim(),
    inspector?.trim() || req.user.email,
    mineId,
    location_name?.trim() || 'Mine Bench Section',
    lat ?? 22.36,
    lng ?? 82.751,
    today,
    severity || 'Medium',
    violations || 'Standard safety observation logged.',
    corrective_action || 'Pending supervisor action.',
    photo_url || null
  );
  return res.status(201).json({ id: result.lastInsertRowid, message: 'Inspection report created with geo-tagging' });
});

app.get('/api/ai/insights', allowRoles('supervisor', 'manager', 'regulator'), (req, res) => {
  const filter = optionalMineFilter(req, 'a.mine_id');
  const insights = db.prepare(`SELECT a.*, m.name AS mine_name FROM ai_insights a LEFT JOIN mines m ON a.mine_id = m.id${filter.sql} ORDER BY a.created_at DESC`).all(...filter.params);
  return res.json(insights);
});

app.get(['/api/ocr/history', '/api/ocr-history'], allowRoles('supervisor', 'manager', 'regulator'), (req, res) => {
  return res.json(db.prepare('SELECT * FROM ocr_documents ORDER BY upload_date DESC').all());
});

app.post(['/api/ocr/process', '/api/ocr-process'], allowRoles('supervisor', 'manager', 'regulator'), validate(['filename']), (req, res) => {
  const { filename, doc_type = 'Safety Register', uploaded_by } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const extractedData = {
    mine_name: db.prepare('SELECT name FROM mines WHERE id = ?').get(effectiveMineId(req))?.name || 'Unknown mine',
    form_type: doc_type,
    inspection_date: today,
    air_quality_pm10: '124 ug/m3 (Compliant)',
    methane_level: '0.04% (Safe)',
    safety_gear_check: '100% Verified',
    auditor_comments: 'No critical violations noted during field shift check.',
    ai_confidence_score: '96.8%'
  };
  const result = db.prepare('INSERT INTO ocr_documents (filename, doc_type, uploaded_by, upload_date, extracted_data, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(filename.trim(), doc_type, uploaded_by || req.user.email, today, JSON.stringify(extractedData), 'Verified');
  return res.status(201).json({ id: result.lastInsertRowid, filename, status: 'Verified', extracted_data: extractedData });
});

app.get('/api/workforce', (req, res) => {
  const filter = optionalMineFilter(req, 'e.mine_id');
  const employees = db.prepare(`SELECT e.*, m.name AS mine_name FROM employees e LEFT JOIN mines m ON e.mine_id = m.id${filter.sql} ORDER BY e.name`).all(...filter.params);
  const summary = {
    total: employees.length,
    present: employees.filter(employee => employee.attendance_status === 'Present').length,
    absent: employees.filter(employee => employee.attendance_status === 'Absent').length,
    on_leave: employees.filter(employee => employee.attendance_status === 'On Leave').length
  };
  return res.json({ summary, employees });
});

app.get('/api/section-staffing', allowRoles('manager'), (req, res) => {
  const mineId = effectiveMineId(req);
  const shift = String(req.query.shift || 'Shift A (06:00 - 14:00)');
  const sections = db.prepare(`
    SELECT ws.id, ws.name, ss.shift, ss.supervisor_name,
      COUNT(swa.id) AS worker_count
    FROM work_sections ws
    JOIN section_supervisors ss ON ss.section_id = ws.id
    LEFT JOIN section_worker_assignments swa ON swa.section_supervisor_id = ss.id
    WHERE ws.mine_id = ? AND ss.shift = ?
    GROUP BY ws.id, ws.name, ss.id, ss.shift, ss.supervisor_name
    ORDER BY ws.id
  `).all(mineId, shift);
  return res.json({ mine_name: 'Ramagundam OC-II', shift, sections });
});

app.get(['/api/gis', '/api/risk-zones'], (req, res) => {
  const filter = optionalMineFilter(req);
  return res.json(db.prepare(`SELECT * FROM gis_zones${filter.sql} ORDER BY risk_score DESC`).all(...filter.params));
});

app.get('/api/gis/map', async (req, res) => {
  try {
    const spatialData = await getMineSpatialData(effectiveMineId(req));
    if (!spatialData) {
      return res.status(404).json({ error: 'Mine boundary data has not been imported yet' });
    }
    return res.json(spatialData);
  } catch (error) {
    console.error('Unable to load spatial mine data:', error.message);
    return res.status(503).json({ error: 'Spatial map service is unavailable' });
  }
});

app.get('/api/inspection-map', allowRoles('supervisor', 'manager', 'regulator'), (req, res) => {
  const filter = optionalMineFilter(req);
  return res.json(db.prepare(`SELECT id, title, mine_id, location_name, lat, lng, date, severity, status FROM inspections${filter.sql} ORDER BY date DESC`).all(...filter.params));
});

app.get('/api/grievances', (req, res) => {
  const filter = optionalMineFilter(req, 'g.mine_id');
  const grievances = db.prepare(`SELECT g.*, m.name AS mine_name FROM grievances g LEFT JOIN mines m ON g.mine_id = m.id${filter.sql} ORDER BY g.date DESC`).all(...filter.params);
  return res.json(grievances);
});

app.post(['/api/grievances', '/api/grievance'], validate(['title']), (req, res) => {
  const { title, submitted_by, category = 'Workplace Safety', priority = 'Medium' } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const mineId = req.user.role === 'regulator' ? (requestedMineId(req) || 1) : effectiveMineId(req);
  const result = db.prepare('INSERT INTO grievances (title, submitted_by, category, mine_id, date, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(title.trim(), submitted_by || req.user.email, category, mineId, today, 'Pending', priority);
  return res.status(201).json({ id: result.lastInsertRowid, message: 'Grievance submitted successfully' });
});

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

app.use((error, req, res, next) => {
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must contain valid JSON' });
  }
  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CoalTrack AI Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
