# Base Image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Document the application port
EXPOSE 3000


# Start the application
CMD ["node", "index.js"]