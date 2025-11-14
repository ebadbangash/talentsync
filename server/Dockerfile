# Server Dockerfile for TalentSync Backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables (can be overridden at runtime)
ENV PORT=5000
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
