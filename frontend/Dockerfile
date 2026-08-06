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
# Pre-create nginx runtime dirs so the unprivileged `nginx` user (uid 100) can write to them
# when the pod has a read-only root filesystem / non-root securityContext.
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp \
              /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp /run/nginx \
    && touch /run/nginx.pid \
    && chown -R nginx:nginx /var/cache/nginx /run/nginx \
    && chown nginx:nginx /run/nginx.pid
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
