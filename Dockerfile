# Stage 1: Build the Angular app
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Build the Angular app in production mode
RUN npm run build 

# Stage 2: Serve the app with Nginx
FROM nginx:stable

# Copy built files from Stage 1
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copy custom Nginx configuration file (optional)
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80