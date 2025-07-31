# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install required dependencies for Prisma and health checks
RUN apk add --no-cache openssl libc6-compat curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for development)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create uploads directory if needed
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "run", "dev"]
