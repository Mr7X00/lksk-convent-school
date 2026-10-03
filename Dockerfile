# Multi-stage Dockerfile for L.K.S.K Convent School
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Backend Server & Static Host
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install Backend Dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy Application Source
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose HTTP Port
EXPOSE 5000

# Start Application via Node.js
CMD ["node", "backend/src/server.js"]
