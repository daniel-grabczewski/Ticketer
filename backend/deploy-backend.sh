#!/bin/bash
# Run `chmod +x deploy-backend.sh` to make this script executable
# Run './deploy-backend.sh' while in the /backend folder to execute this script

# Exit the script if any command fails
set -e

# Function to log messages
log() {
    echo "[INFO] $1"
}

# Stop any Docker container running on port 8080:8080
log "Stopping any Docker container running on port 8080..."
container_id=$(docker ps -q --filter "publish=8080")
if [ -n "$container_id" ]; then
    docker stop "$container_id"
    log "Stopped container with ID: $container_id"
else
    log "No container found running on port 8080."
fi

# Build the Docker image with a timestamp as the tag
timestamp=$(date +%Y%m%d%H%M%S)
log "Building new Docker image with tag: backend:$timestamp..."
docker build -t backend:$timestamp .

# Run the new container on port 8080:8080 with sleep infinity
log "Running new Docker container on port 8080:8080 with sleep infinity"
docker run -d -p 8080:8080 backend:$timestamp sh -c "dotnet backend.dll & sleep infinity"


# Reload Nginx
log "Reloading Nginx..."
sudo systemctl reload nginx

log "Deployment completed successfully. New container running on port 8080 with sleep infinity."
