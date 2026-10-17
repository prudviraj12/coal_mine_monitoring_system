let pool;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    const { Pool } = require('pg');
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

async function getMineSpatialData(operationalMineId) {
  const client = getPool();
  if (!client) return null;

  const { rows } = await client.query(`
    SELECT m.id, m.name, ST_AsGeoJSON(m.boundary)::json AS boundary,
      COALESCE((SELECT json_agg(section_data ORDER BY section_data.name) FROM (
        SELECT s.id, s.name, s.section_type, ST_AsGeoJSON(s.boundary)::json AS boundary
        FROM spatial_sections s WHERE s.mine_id = m.id
      ) section_data), '[]'::json) AS sections,
      COALESCE((SELECT json_agg(hazard_data ORDER BY hazard_data.detected_at DESC) FROM (
        SELECT h.id, h.hazard_type, h.risk_level, h.status, h.description, h.detected_at,
          ST_AsGeoJSON(h.geometry)::json AS geometry
        FROM spatial_hazards h WHERE h.mine_id = m.id AND h.status != 'Resolved'
      ) hazard_data), '[]'::json) AS hazards
    FROM spatial_mines m
    WHERE m.operational_mine_id = $1
  `, [operationalMineId]);
  return rows[0] || null;
}

module.exports = { getMineSpatialData };
