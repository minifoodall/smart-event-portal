# Docker Cheat-Sheet (used in the project demo)

```bash
# Phase 2 — Task 1 / 2: Build images for v1, v2, v3
docker build -t eventportal-backend:v1   ./backend
docker build -t eventportal-frontend:v1 --build-arg VITE_API_URL=/api --build-arg VITE_APP_VERSION=v1 ./frontend

docker build -t eventportal-backend:v2   ./backend
docker build -t eventportal-frontend:v2 --build-arg VITE_API_URL=/api --build-arg VITE_APP_VERSION=v2 ./frontend

docker build -t eventportal-backend:v3   ./backend
docker build -t eventportal-frontend:v3 --build-arg VITE_API_URL=/api --build-arg VITE_APP_VERSION=v3 ./frontend

# Task 3: Run a single container
docker run -d -p 3000:80 --name eventportal-frontend eventportal-frontend:v1
docker run -d -p 5000:5000 --name eventportal-backend eventportal-backend:v1

# Task 4: Inspect
docker ps
docker inspect eventportal-backend
docker logs eventportal-backend
docker exec -it eventportal-backend sh

# Task 5: v1 → v2 (dark mode) → v3 (event search)
#   Edit frontend/src/context/ThemeContext.jsx + Home.jsx, rebuild tag v2/v3
#   Visible change shown in browser and via curl /api/health returning "version":"v2" etc.

# Task 6: Push to Docker Hub
docker login
docker tag eventportal-backend:v1  gunjkushwaha/eventportal-backend:v1
docker tag eventportal-frontend:v1 gunjkushwaha/eventportal-frontend:v1
docker push gunjkushwaha/eventportal-backend:v1
docker push gunjkushwaha/eventportal-frontend:v1

# Task 7: Docker command reference (used in the demo)
docker images
docker ps -a
docker stop eventportal-backend
docker start eventportal-backend
docker restart eventportal-backend
docker logs --tail 50 eventportal-backend
docker exec -it eventportal-backend sh
docker rm eventportal-backend
docker rmi eventportal-backend:v1
```
