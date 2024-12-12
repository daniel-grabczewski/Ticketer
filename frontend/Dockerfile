# First stage: Build the Angular app
FROM node:22 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Set npm registry for faster downloads (optional but helpful for performance)
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies
RUN npm install --force --loglevel=warn --verbose

# Copy the rest of the application files
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production --verbose

# Second stage: Use NGINX to serve the built app
FROM nginx:stable-alpine

# Set the working directory for NGINX
WORKDIR /usr/share/nginx/html

# Remove default NGINX static files
RUN rm -rf ./*

# Copy the built Angular app files from the 'build' stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
