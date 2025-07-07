FROM node:18-alpine

# Install dependencies required for sharp (image processing)
RUN apk add --no-cache vips-dev build-base python3

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app will run on
EXPOSE 1337

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]