# Architecture

```
                    ┌────────────────────────┐
                    │   GitHub Repository    │
                    │  (source of truth)     │
                    └────────────┬───────────┘
                                 │  push (webhook)
                                 ▼
            ┌────────────────────────────────────┐
            │   GitHub Actions (ci-notify.yml)   │
            │   → calls Jenkins generic webhook  │
            └─────────────────┬──────────────────┘
                              ▼
            ┌────────────────────────────────────┐
            │       Jenkins (Jenkinsfile)        │
            │  Checkout → Test → Build →         │
            │  Trivy → Push → Deploy → Verify    │
            │  (auto rollback on failure)        │
            └──────────┬─────────────┬───────────┘
                       │             │
                       ▼             ▼
              ┌────────────────┐  ┌─────────────────┐
              │  Docker Hub    │  │  Kubernetes     │
              │  (image reg.)  │  │  Cluster        │
              └────────────────┘  └────────┬────────┘
                                           │
                ┌──────────────────────────┼──────────────────────────┐
                │                          │                          │
                ▼                          ▼                          ▼
        ┌───────────────┐         ┌────────────────┐         ┌─────────────────┐
        │  Frontend Pod │ ◄─────  │   Ingress      │ ──────► │  Backend Pod(s) │
        │  (Nginx +     │         │  (NGINX)       │         │  (Node.js)      │
        │   React SPA)  │         │  /api → backend│         │                 │
        └───────────────┘         └────────────────┘         └────────┬────────┘
                                                                     │
                                                              ┌──────▼──────┐
                                                              │  Mongo Pod  │
                                                              │  (StatefulSet│
                                                              │   + PVC)    │
                                                              └─────────────┘

   Monitoring (Prometheus + Grafana)  •  Canary (Istio VS/DR)  •  GitOps (Argo CD)
```

## Component summary

| Layer        | Tech                          | Notes                                                  |
|--------------|-------------------------------|--------------------------------------------------------|
| Source       | GitHub                        | Single repo, branch + tag strategy                     |
| CI trigger   | GitHub Actions → Jenkins      | Generic webhook trigger                                |
| CI/CD        | Jenkins                       | Declarative pipeline, auto-rollback post               |
| Registry     | Docker Hub                    | Tagged images per build                                |
| Security     | Trivy                         | HIGH/CRITICAL scan per build                           |
| Orchestration| Kubernetes                    | Deployments, Services, Ingress, HPA-ready              |
| Database     | MongoDB (StatefulSet)         | PVC-backed; only one replica for the demo              |
| Ingress      | NGINX                         | Path-rewrite to expose `/api`                          |
| Monitoring   | Prometheus + Grafana          | ServiceMonitor + alert rules + dashboard JSON          |
| Progressive  | Istio VirtualService          | 90/10 stable/canary split                              |
| GitOps       | Argo CD                       | Pulls `k8s/overlays` from Git                          |
| Packaging    | Helm chart                    | Alternative install path                               |
| Secrets      | K8s Secrets (Sealed Secrets)  | Rotated outside the repo                               |
