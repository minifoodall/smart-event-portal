# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ---------- Runtime stage ----------
FROM node:20-alpine
# Security: run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1
USER appuser
CMD ["node", "src/server.js"]
