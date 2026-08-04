#!/usr/bin/env bash
# scripts/deploy-k8s.sh — Phase 3 deliverable: end-to-end Kubernetes commands
set -euo pipefail

NS=event-portal
echo "▶️  Applying base manifests"
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/base/secrets.yaml
kubectl apply -f k8s/base/mongo.yaml
kubectl apply -f k8s/base/backend.yaml
kubectl apply -f k8s/base/frontend.yaml
kubectl apply -f k8s/base/ingress.yaml || true

echo "▶️  Waiting for pods to be ready"
kubectl -n $NS wait --for=condition=ready pod -l app=backend  --timeout=120s
kubectl -n $NS wait --for=condition=ready pod -l app=frontend --timeout=120s

echo "▶️  Exposing the app"
kubectl -n $NS port-forward svc/frontend 8080:80 &
PORT_FWD_PID=$!
sleep 3
echo "Open http://localhost:8080  (Ctrl-C to stop the port-forward)"
trap "kill $PORT_FWD_PID 2>/dev/null || true" EXIT
wait
