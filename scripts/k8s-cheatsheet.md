# k8s Cheat-Sheet (used in the project demo)

```bash
# 1. Apply all resources
kubectl apply -f k8s/base/

# 2. Verify pods & services
kubectl -n event-portal get pods
kubectl -n event-portal get svc

# 3. Describe one pod
kubectl -n event-portal describe pod -l app=backend

# 4. Tail logs
kubectl -n event-portal logs -f deployment/backend

# 5. Scale backend to 1, 3, 5 replicas (Phase 3 Task 4)
kubectl -n event-portal scale deployment/backend --replicas=1
kubectl -n event-portal scale deployment/backend --replicas=3
kubectl -n event-portal scale deployment/backend --replicas=5
kubectl -n event-portal get pods -l app=backend

# 6. Rolling update (Phase 3 Task 5) — push v2 image first
kubectl -n event-portal set image deployment/backend backend=gunjkushwaha/eventportal-backend:v2 --record
kubectl -n event-portal rollout status deployment/backend
kubectl -n event-portal rollout history deployment/backend

# 7. Rollback (Phase 3 Task 6)
kubectl -n event-portal rollout undo deployment/backend
kubectl -n event-portal rollout status deployment/backend

# 8. Exec into a container
kubectl -n event-portal exec -it deployment/backend -- sh
```
