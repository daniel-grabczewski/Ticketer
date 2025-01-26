#!/bin/bash
# Run `chmod +x deploy-frontend.sh` to make this script executable
# Run './deploy-frontend.sh' while in the /frontend folder to execute this script

# Exit the script if any command fails
set -e

# Function to log messages
log() {
    echo "[INFO] $1"
}

# Stop any Docker container running on port 8081
log "Stopping any Docker container running on port 8081..."
container_id=$(docker ps -q --filter "publish=8081")
if [ -n "$container_id" ]; then
    docker stop "$container_id"
    log "Stopped container with ID: $container_id"
else
    log "No container found running on port 8081."
fi

# Build the Docker image with a timestamp as the tag
timestamp=$(date +%Y%m%d%H%M%S)
log "Building new Docker image with tag: frontend:$timestamp..."
docker build -t frontend:$timestamp .

# Run the new container on port 8081 with tail -f /dev/null
log "Running new Docker container on port 8081 with tail -f /dev/null..."
docker run -d -p 8081:80 frontend:$timestamp sh -c "nginx -g 'daemon off;' && tail -f /dev/null"


# Reload Nginx
log "Reloading Nginx..."
sudo systemctl reload nginx

log "Deployment completed successfully. New container running on port 8081 with tail -f /dev/null."
