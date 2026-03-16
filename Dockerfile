# Stage 1: Build frontend
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner
WORKDIR /app

# Install only production deps (need better-sqlite3 native module)
COPY package.json ./
RUN npm install --omit=dev

# Copy built frontend and backend
COPY --from=builder /app/dist ./dist
COPY backend ./backend

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "backend/index.js"]
