# Release Notes

This file documents the three image versions required by the project (Phase 2 Task 5: v1, v2, v3).

## v1.0.0 — Initial release (`v1`)
- React frontend with Home, Login, Register, EventDetail, MyBookings, Admin pages
- Node.js + Express + MongoDB backend (auth, events, bookings, admin)
- JWT-based auth with bcrypt password hashing
- Dockerized frontend (Nginx) and backend
- Local stack via `docker-compose.yml`
- Base Kubernetes manifests (Deployment + Service + Ingress)
- Jenkins pipeline: build, test, push, deploy, verify

## v2.0.0 — Dark Mode (`v2`)
- **Visible change:** Theme toggle button in the navbar; dark color scheme persisted in `localStorage`
- Why: improves UX and demonstrates a UI-only feature that ships independently (no DB migration, no API change)
- Files: `frontend/src/context/ThemeContext.jsx`, `frontend/src/components/ThemeToggle.jsx`, `frontend/src/styles/global.css`
- Image tags: `gunjkushwaha/eventportal-frontend:v2`, `gunjkushwaha/eventportal-backend:v2` (no backend change — same image re-tagged)

## v3.0.0 — Event Search & Filter (`v3`)
- **Visible change:** search box + category filter on the Home page; "no results" empty state
- Why: showcases backend search indexing (MongoDB text index) and demonstrates a feature spanning both tiers
- Files: `frontend/src/pages/Home.jsx`, `backend/src/models/Event.js` (text index), `backend/src/routes/event.routes.js` (`$text` filter)
- Image tags: `gunjkushwaha/eventportal-frontend:v3`, `gunjkushwaha/eventportal-backend:v3`

## Rollback procedure
```bash
kubectl -n event-portal rollout undo deployment/backend
kubectl -n event-portal rollout undo deployment/frontend
```
Or in Jenkins: re-run with parameter `TRIGGER_ROLLBACK=true` and `PREVIOUS_VERSION=v2` (etc.).
