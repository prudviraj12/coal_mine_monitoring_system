# CoalTrack AI

## Run the complete application

From this project root, run:

```powershell
npm run dev
```

This starts both required services:

- Frontend: http://127.0.0.1:3000
- Backend: http://127.0.0.1:5000

Starting only the frontend will leave login unavailable because authentication is handled by the backend.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Worker | `worker@coaltrack.gov.in` | `work123` |
| Supervisor | `supervisor@coaltrack.gov.in` | `sup123` |
| Manager | `manager@coaltrack.gov.in` | `man123` |
| Regulator | `regulator@coaltrack.gov.in` | `reg123` |
| System administrator | `admin@coaltrack.gov.in` | `admin123` |

Run all automated tests with `npm test` and build the frontend with `npm run build`.

## GIS database (PostgreSQL + PostGIS)

For mine boundaries, section polygons, hazards, and worker GPS events, start the local PostGIS service:

```bash
docker compose up -d postgis
```

Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`. The database schema is created automatically by Docker. Import only approved mine-plan GeoJSON/KML coordinates into `spatial_mines` and `spatial_sections`; the project intentionally does not create guessed safety boundaries.
