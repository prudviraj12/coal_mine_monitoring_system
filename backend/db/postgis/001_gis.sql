CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS spatial_mines (
  id BIGSERIAL PRIMARY KEY,
  operational_mine_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  operator_name TEXT NOT NULL,
  boundary geometry(Polygon, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spatial_sections (
  id BIGSERIAL PRIMARY KEY,
  mine_id BIGINT NOT NULL REFERENCES spatial_mines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  section_type TEXT NOT NULL,
  boundary geometry(Polygon, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mine_id, name)
);

CREATE TABLE IF NOT EXISTS spatial_section_supervisors (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT NOT NULL REFERENCES spatial_sections(id) ON DELETE CASCADE,
  shift_name TEXT NOT NULL,
  supervisor_employee_id TEXT NOT NULL,
  active_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active_until TIMESTAMPTZ,
  UNIQUE(section_id, shift_name, active_from)
);

CREATE TABLE IF NOT EXISTS spatial_hazards (
  id BIGSERIAL PRIMARY KEY,
  mine_id BIGINT NOT NULL REFERENCES spatial_mines(id) ON DELETE CASCADE,
  section_id BIGINT REFERENCES spatial_sections(id) ON DELETE SET NULL,
  hazard_type TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Open',
  description TEXT,
  geometry geometry(Geometry, 4326) NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS worker_location_events (
  id BIGSERIAL PRIMARY KEY,
  mine_id BIGINT NOT NULL REFERENCES spatial_mines(id) ON DELETE CASCADE,
  employee_code TEXT NOT NULL,
  section_id BIGINT REFERENCES spatial_sections(id) ON DELETE SET NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location geometry(Point, 4326) NOT NULL,
  source TEXT NOT NULL DEFAULT 'gps'
);

CREATE INDEX IF NOT EXISTS spatial_mines_boundary_idx ON spatial_mines USING GIST (boundary);
CREATE INDEX IF NOT EXISTS spatial_sections_boundary_idx ON spatial_sections USING GIST (boundary);
CREATE INDEX IF NOT EXISTS spatial_hazards_geometry_idx ON spatial_hazards USING GIST (geometry);
CREATE INDEX IF NOT EXISTS worker_location_events_location_idx ON worker_location_events USING GIST (location);
CREATE INDEX IF NOT EXISTS worker_location_events_latest_idx ON worker_location_events (employee_code, recorded_at DESC);

-- Import the approved Ramagundam OC-II mine-plan GeoJSON/KML coordinates here.
-- Do not seed guessed safety boundaries or hazard positions.
