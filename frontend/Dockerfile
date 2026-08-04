# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL=/api
ARG VITE_APP_VERSION=1.0.0
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_VERSION=$VITE_APP_VERSION
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine
# Security: drop privileges
RUN addgroup -S appgroup 2>/dev/null || true
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
