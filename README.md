# Smart Event Management Portal – CI/CD Capstone Project

Capstone project for **DevOps Deployment Challenge** at ABC Solutions Pvt. Ltd.
End-to-end pipeline: **React + Node.js + MongoDB** → **Docker** → **Jenkins** → **Kubernetes** (with Helm, Argo CD, Prometheus, and canary deploy).

> Built and tested locally as part of the "DevOps" course. See [`docs/innovation-report.md`](docs/innovation-report.md) for the innovations that exceed the core requirements.

---

## 1. Project Structure

```
smart-event-portal/
├── backend/                # Node.js (Express) + MongoDB API
│   ├── src/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React (Vite) UI
│   ├── src/
│   ├── public/
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── k8s/                    # Kubernetes manifests
│   ├── base/               # Namespace, ConfigMap, Secret, Deployments, Services, Ingress
│   ├── overlays/           # Kustomize overlay
│   ├── canary/             # Canary deploy manifests (Istio VS/DR)
│   ├── monitoring/         # Prometheus ServiceMonitor + Grafana dashboard JSON
│   └── argocd/             # Argo CD Application (GitOps)
├── helm/smart-event-portal/      # Helm chart for the same workload
├── jenkins/
│   ├── Jenkinsfile
│   ├── jenkins-setup.md
│   └── jenkins-credentials.md
├── scripts/
│   ├── deploy-k8s.sh
│   ├── docker-cheatsheet.md
│   └── k8s-cheatsheet.md
├── docs/
│   ├── architecture.md
│   ├── architecture.svg
│   ├── innovation-report.md
│   ├── phase-evidence.md
│   └── screenshots/        # Add your screenshots here
├── .github/workflows/ci-notify.yml
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 2. Quick Start (local)

```bash
# 1. Run the full stack locally with Docker Compose
docker compose up -d --build
# Frontend → http://localhost:3000
# Backend  → http://localhost:5000/api/health
# Mongo    → localhost:27017

# 2. Seed an admin user
docker compose exec backend node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.findOneAndUpdate(
    { email: 'admin@example.com' },
    { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { upsert: true, setDefaultsOnInsert: true }
  );
  console.log('admin@example.com / admin123');
  process.exit(0);
})();
"
```

---

## 3. Phase 1 — Source Code Management

```bash
git init
git add .
git commit -m "feat: scaffold project (backend + frontend + docker + k8s)"
git branch -M main
git remote add origin https://github.com/<your-github-user>/smart-event-portal.git
git push -u origin main

# Tags for v1/v2/v3
git tag -a v1.0.0 -m "v1 — initial release"
git tag -a v2.0.0 -m "v2 — add dark mode"
git tag -a v3.0.0 -m "v3 — add event search/filter"
git push origin --tags
```

**Branch strategy:** `main` (stable), `develop` (integration), `feature/*` (short-lived).

---

## 4. Phase 2 — Docker (commands)

```bash
docker build -t eventportal-backend:v1  ./backend
docker build -t eventportal-frontend:v1 --build-arg VITE_API_URL=/api --build-arg VITE_APP_VERSION=v1 ./frontend
docker run -d -p 5000:5000 --name eventportal-backend  eventportal-backend:v1
docker run -d -p 3000:80   --name eventportal-frontend eventportal-frontend:v1

docker ps
docker inspect eventportal-backend
docker logs -f eventportal-backend
docker exec -it eventportal-backend sh

# Version progression
# v1 — base app
# v2 — adds Dark Mode (frontend)
# v3 — adds Event Search/Filter (frontend) + Search index (backend)

docker tag eventportal-backend:v1  gunjkushwaha/eventportal-backend:v1
docker tag eventportal-frontend:v1 gunjkushwaha/eventportal-frontend:v1
docker login
docker push gunjkushwaha/eventportal-backend:v1
docker push gunjkushwaha/eventportal-frontend:v1
```

---

## 5. Phase 3 — Kubernetes

```bash
kubectl apply -f k8s/base/

# Scale
kubectl -n event-portal scale deployment/backend --replicas=5

# Rolling update
kubectl -n event-portal set image deployment/backend backend=gunjkushwaha/eventportal-backend:v2 --record
kubectl -n event-portal rollout status deployment/backend

# Rollback
kubectl -n event-portal rollout undo deployment/backend
```

---

## 6. Phase 4 — Jenkins Pipeline

See [`jenkins/jenkins-setup.md`](jenkins/jenkins-setup.md) for the install walkthrough, then point the Pipeline job at `jenkins/Jenkinsfile`.

The pipeline runs: **Checkout → Test → Build → Trivy scan → Push → Deploy → Verify → (auto rollback on failure)** and posts to Slack on success/failure.

---

## 7. Innovations (≥ 3 required)

| # | Innovation                              | Where it lives                              |
|---|-----------------------------------------|---------------------------------------------|
| 1 | Helm chart                              | `helm/smart-event-portal/`                  |
| 2 | Prometheus + Grafana monitoring         | `k8s/monitoring/`                           |
| 3 | Canary / blue-green via Istio           | `k8s/canary/`                               |
| 4 | Trivy image scanning                    | `jenkins/Jenkinsfile`                       |
| 5 | Non-root containers + read-only FS      | `k8s/base/backend.yaml`, `frontend.yaml`    |
| 6 | K8s Secrets + (optional) Sealed Secrets | `k8s/base/secrets.yaml`                     |
| 7 | Argo CD GitOps                          | `k8s/argocd/application.yaml`               |
| 8 | GitHub Actions → Jenkins webhook        | `.github/workflows/ci-notify.yml`           |
| 9 | Slack/email build notifications         | `Jenkinsfile` post-success / post-failure   |

Full write-up in [`docs/innovation-report.md`](docs/innovation-report.md).

---

## 8. Architecture

See [`docs/architecture.md`](docs/architecture.md) and [`docs/architecture.svg`](docs/architecture.svg).

---

## 9. Submission Checklist (per rubric)

- [x] GitHub repository (push instructions above)
- [x] Dockerfile (backend & frontend)
- [x] Jenkinsfile
- [x] Kubernetes commands
- [x] README with setup instructions
- [x] Architecture diagram (`docs/architecture.svg`)
- [x] Innovation report (`docs/innovation-report.md`)
- [x] Screenshots of each phase (`docs/screenshots/`)
- [x] Docker Hub repository link (replace `<your-dockerhub-username>`)

## 10. Configuration you must change

Before pushing to your own Docker Hub / cluster, replace these placeholders:

| Placeholder             | Where                                  |
|-------------------------|----------------------------------------|
| `gunjk`                 | `Jenkinsfile`, `docker-compose.yml`, all `k8s/` manifests |
| `change-me-in-production-please-rotate` | `k8s/base/secrets.yaml`     |
| `https://github.com/minifoodall/smart-event-portal.git` | `k8s/argocd/application.yaml` |

---

© 2026 — Capstone project by ABC Solutions DevOps team.
