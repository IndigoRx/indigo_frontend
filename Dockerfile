# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder


# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the app in production
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only what’s needed from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4001

# Expose port 4001
EXPOSE 4001

# Start the Next.js app
CMD ["npm", "start"]
