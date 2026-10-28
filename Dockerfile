# Step 1: Build Frontend Client
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Step 2: Setup Server & Final Runtime
FROM node:22-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy built frontend assets from client-builder into client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# Ensure data directory exists for SQLite
RUN mkdir -p /app/server/data

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server/src/index.js"]

