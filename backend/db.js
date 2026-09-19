const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { hashPassword } = require('./auth');

const dbPath = process.env.COALTRACK_DB_PATH
  ? path.resolve(process.env.COALTRACK_DB_PATH)
  : path.join(__dirname, 'data', 'coaltrack.sqlite');
const dataDirectory = path.dirname(dbPath);

// Ensure data folder exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initDb() {
  // Create Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL, -- supervisor, manager, regulator
      mine_id INTEGER,
      avatar TEXT,
      password_hash TEXT
    );

    CREATE TABLE IF NOT EXISTS mines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      subsidiary TEXT NOT NULL,
      location TEXT NOT NULL,
      lat REAL,
      lng REAL,
      status TEXT DEFAULT 'Active',
      safety_score INTEGER DEFAULT 85,
      production_target INTEGER,
      production_actual INTEGER
    );

    CREATE TABLE IF NOT EXISTS compliance_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      authority TEXT NOT NULL, -- DGMS, MoEFCC, CPCB, CCO, Labour
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL, -- Safety, Environmental, Production, Labour
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'Pending', -- Compliant, Pending, Overdue, Warning
      score INTEGER DEFAULT 90,
      mine_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS inspections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      inspector TEXT NOT NULL,
      mine_id INTEGER,
      location_name TEXT NOT NULL,
      lat REAL,
      lng REAL,
      date TEXT NOT NULL,
      severity TEXT NOT NULL, -- Low, Medium, High, Critical
      status TEXT DEFAULT 'Open', -- Open, In Progress, Resolved
      violations TEXT,
      corrective_action TEXT,
      photo_url TEXT
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      mine_id INTEGER,
      shift TEXT NOT NULL,
      attendance_status TEXT DEFAULT 'Present', -- Present, Absent, On Leave, Late
      health_cleared INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS ai_insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mine_id INTEGER,
      risk_type TEXT NOT NULL, -- Hazard, Anomaly, Slope Instability, Emission, Attendance
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      risk_level TEXT NOT NULL, -- Low, Moderate, High, Critical
      recommendation TEXT NOT NULL,
      confidence INTEGER DEFAULT 92,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ocr_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      uploaded_by TEXT NOT NULL,
      upload_date TEXT NOT NULL,
      extracted_data TEXT NOT NULL, -- JSON string
      status TEXT DEFAULT 'Verified'
    );

    CREATE TABLE IF NOT EXISTS grievances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      submitted_by TEXT NOT NULL,
      category TEXT NOT NULL,
      mine_id INTEGER,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Pending', -- Pending, Under Review, Resolved
      priority TEXT DEFAULT 'Medium'
    );

    CREATE TABLE IF NOT EXISTS gis_zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mine_id INTEGER,
      zone_name TEXT NOT NULL,
      zone_type TEXT NOT NULL, -- Extraction Pit, Dumper Route, Risk Zone, Eco Zone
      risk_score INTEGER DEFAULT 45,
      lat REAL,
      lng REAL,
      methane_ppm REAL,
      dust_pm10 REAL
    );
  `);

  // Migrate databases created before password authentication was introduced.
  const userColumns = db.prepare('PRAGMA table_info(users)').all();
  if (!userColumns.some(column => column.name === 'password_hash')) {
    db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
  }

  // Seed Data if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    // Seed Users
    const insertUser = db.prepare('INSERT INTO users (name, email, role, mine_id, avatar, password_hash) VALUES (?, ?, ?, ?, ?, ?)');
    insertUser.run('Rajesh Kumar', 'supervisor@coaltrack.gov.in', 'supervisor', 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', hashPassword('sup123'));
    insertUser.run('Anil Sharma (General Manager)', 'manager@coaltrack.gov.in', 'manager', 1, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', hashPassword('man123'));
    insertUser.run('Dr. V. K. Singh (DGMS Regulator)', 'regulator@coaltrack.gov.in', 'regulator', null, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', hashPassword('reg123'));
    insertUser.run('Ramesh Yadav', 'worker@coaltrack.gov.in', 'worker', 1, null, hashPassword('work123'));

    // Seed Mines
    const insertMine = db.prepare('INSERT INTO mines (name, code, subsidiary, location, lat, lng, status, safety_score, production_target, production_actual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertMine.run('Korba Opencast Pit B', 'KRB-01', 'SECL', 'Korba, Chhattisgarh', 22.3595, 82.7501, 'Active', 88, 120000, 114500);
    insertMine.run('Jharia Underground Block-3', 'JHR-03', 'BCCL', 'Dhanbad, Jharkhand', 23.7417, 86.4156, 'Active', 79, 85000, 78200);
    insertMine.run('Singrauli North Quarry', 'SNG-02', 'NCL', 'Singrauli, Madhya Pradesh', 24.1981, 82.6685, 'Active', 93, 150000, 152100);

    // Seed Compliance Rules
    const insertRule = db.prepare('INSERT INTO compliance_rules (authority, title, description, category, due_date, status, score, mine_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    insertRule.run('DGMS', 'Quarterly Ventilation & Slope Stability Audit', 'Mandatory inspection under CMR 2017 Regulation 160', 'Safety', '2026-09-30', 'Warning', 78, 1);
    insertRule.run('MoEFCC', 'Ambient Air & Particulate Matter Emission Return', 'Quarterly stack & dust suppression monitoring submission', 'Environmental', '2026-10-15', 'Compliant', 95, 1);
    insertRule.run('CPCB', 'Effluent & Mine Water Discharge Quality Check', 'Biological oxygen demand & pH compliance submission', 'Environmental', '2026-09-25', 'Pending', 88, 1);
    insertRule.run('Labour Dept', 'Contractor Worker Insurance & PF Verification', 'Verification of Form B register & statutory insurance', 'Labour', '2026-09-20', 'Compliant', 92, 1);
    insertRule.run('CCO', 'Monthly Coal Production & Offtake Returns', 'Statutory coal grade & tonnage verification return', 'Production', '2026-10-05', 'Compliant', 98, 1);

    // Seed Inspections
    const insertInspection = db.prepare('INSERT INTO inspections (title, inspector, mine_id, location_name, lat, lng, date, severity, status, violations, corrective_action, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertInspection.run(
      'Haul Road Dust Suppression & Barrier Audit',
      'Rajesh Kumar',
      1,
      'North Access Ramp - Bench 4',
      22.3612,
      82.7523,
      '2026-09-17',
      'Medium',
      'In Progress',
      'High PM10 dust plume observed due to delayed water tanker schedule.',
      'Deploy 2 additional water sprinklers immediately on Bench 4 ramp.',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500'
    );
    insertInspection.run(
      'Methane & Roof Support Underground Audit',
      'S. K. Verma (Safety Officer)',
      2,
      'Sub-Level 3 Seam 7',
      23.7425,
      86.4168,
      '2026-09-18',
      'High',
      'Open',
      'Elevated CH4 gas reading (0.8%) near ventilation return airway.',
      'Evacuate section B, increase auxiliary fan intake by 15%.',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500'
    );

    // Seed Employees
    const insertEmp = db.prepare('INSERT INTO employees (emp_id, name, role, department, mine_id, shift, attendance_status, health_cleared) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    insertEmp.run('EMP-1001', 'Ramesh Yadav', 'Excavator Operator', 'Operations', 1, 'Shift A (06:00 - 14:00)', 'Present', 1);
    insertEmp.run('EMP-1002', 'Suresh Mahto', 'Blasting Incharge', 'Safety', 1, 'Shift A (06:00 - 14:00)', 'Present', 1);
    insertEmp.run('EMP-1003', 'Vikram Soren', 'Haul Truck Driver', 'Logistics', 1, 'Shift B (14:00 - 22:00)', 'Present', 1);
    insertEmp.run('EMP-1004', 'Amit Bauri', 'Underground Helper', 'Maintenance', 2, 'Shift A (06:00 - 14:00)', 'Absent', 0);
    insertEmp.run('EMP-1005', 'Manoj Paswan', 'Surveyor Assistant', 'Mining Engineering', 1, 'Shift A (06:00 - 14:00)', 'Present', 1);

    // Seed AI Insights
    const insertAI = db.prepare('INSERT INTO ai_insights (mine_id, risk_type, title, description, risk_level, recommendation, confidence, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    insertAI.run(
      1,
      'Slope Instability',
      'High Slope Deformation Detected at Highwall Bench 3',
      'Radar telemetry indicates 4.2mm micro-displacement over the last 12 hours along fracture plane B.',
      'High',
      'Halt heavy excavator movements near Bench 3 highwall. Deploy ground survey radar immediately.',
      94,
      '2026-09-18 08:30'
    );
    insertAI.run(
      1,
      'Attendance Anomaly',
      'Contractor Shift B Absenteeism Spike (18%)',
      'Predictive model flags risk of production deficit on Dumper Route 2 due to absent night operators.',
      'Moderate',
      'Re-allocate 4 standby drivers from Block C pool to prevent haulage bottleneck.',
      89,
      '2026-09-18 11:15'
    );
    insertAI.run(
      2,
      'Hazard',
      'Underground Methane Accumulation Risk',
      'Ambient gas trend model forecasts potential CH4 threshold breach (1.0%) within 4 hours if ventilation speed is unadjusted.',
      'Critical',
      'Automate auxiliary fan override to 100% capacity and alert Shift Incharge.',
      96,
      '2026-09-18 14:00'
    );

    // Seed OCR Documents
    const insertOCR = db.prepare('INSERT INTO ocr_documents (filename, doc_type, uploaded_by, upload_date, extracted_data, status) VALUES (?, ?, ?, ?, ?, ?)');
    insertOCR.run(
      'DGMS_Form_IV_Safety_Register_Sept2026.pdf',
      'DGMS Statutory Register',
      'Rajesh Kumar',
      '2026-09-15',
      JSON.stringify({
        mine_name: 'Korba Opencast Pit B',
        inspector: 'V. K. Singh',
        compliance_status: 'Compliant with minor observations',
        ventilation_cfm: '45,000 CFM',
        gas_readings: 'CO2: 0.03%, CH4: 0.05%',
        safety_clearance: 'APPROVED'
      }),
      'Verified'
    );

    // Seed Grievances
    const insertGrievance = db.prepare('INSERT INTO grievances (title, submitted_by, category, mine_id, date, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertGrievance.run('Dust suppression water truck schedule delay on Bench 2', 'Ramesh Yadav', 'Workplace Safety', 1, '2026-09-16', 'Under Review', 'High');
    insertGrievance.run('Lighting repairs needed near dumper maintenance bay', 'Vikram Soren', 'Infrastructure', 1, '2026-09-17', 'Pending', 'Medium');

    // Seed GIS Zones
    const insertGIS = db.prepare('INSERT INTO gis_zones (mine_id, zone_name, zone_type, risk_score, lat, lng, methane_ppm, dust_pm10) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    insertGIS.run(1, 'Active Coal Extraction Face A', 'Extraction Pit', 35, 22.3598, 82.7505, 0.02, 145);
    insertGIS.run(1, 'Highwall Bench 3 (Slope Hazard)', 'Risk Zone', 82, 22.3615, 82.7530, 0.01, 210);
    insertGIS.run(1, 'Dumper Transport Route North', 'Dumper Route', 40, 22.3580, 82.7485, 0.03, 180);
    insertGIS.run(1, 'Settling Basin & Eco Barrier', 'Eco Zone', 15, 22.3550, 82.7450, 0.00, 65);
  }

  // Keep the documented demo accounts usable when upgrading an existing database.
  const demoAccounts = [
    ['supervisor@coaltrack.gov.in', 'sup123'],
    ['manager@coaltrack.gov.in', 'man123'],
    ['regulator@coaltrack.gov.in', 'reg123']
  ];
  const setPassword = db.prepare('UPDATE users SET password_hash = ? WHERE email = ? AND (password_hash IS NULL OR password_hash = \'\')');
  for (const [email, password] of demoAccounts) {
    setPassword.run(hashPassword(password), email);
  }

  const worker = db.prepare('SELECT id FROM users WHERE email = ?').get('worker@coaltrack.gov.in');
  if (!worker) {
    db.prepare('INSERT INTO users (name, email, role, mine_id, avatar, password_hash) VALUES (?, ?, ?, ?, ?, ?)')
      .run('Ramesh Yadav', 'worker@coaltrack.gov.in', 'worker', 1, null, hashPassword('work123'));
  }
}

initDb();

module.exports = db;
