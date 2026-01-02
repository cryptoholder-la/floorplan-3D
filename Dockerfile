# Use Node.js 18 LTS for better compatibility
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with Alpine package manager
RUN apk add --no-cache python3 make g++

# Install dependencies
RUN npm ci --only=production

# Install tslib specifically for TypeScript compilation
RUN npm install tslib --save-dev

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
