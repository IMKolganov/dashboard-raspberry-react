# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install curl
RUN apk update && apk add --no-cache curl

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application code
COPY . .

# Build the application
RUN npm run build

# Set environment variable for the static server
ENV PORT=3000

# Set the command to run the server
CMD ["npx", "serve", "-s", "build", "-l", "3000"]

# Expose the port for the application
EXPOSE 3000