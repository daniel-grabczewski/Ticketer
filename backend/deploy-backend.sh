#!/bin/bash
# Run `chmod +x deploy-backend.sh` to make this script executable
# Run './deploy-backend.sh' while in the /backend folder to execute this script

# Exit the script if any command fails
set -e

# Function to log messages
log() {
    echo "[INFO] $1"
}

# Define a consistent name for the container so we can easily find/stop it later
CONTAINER_NAME="ticketer-backend"

# Stop and remove the existing container by name
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
    log "Stopping and removing existing container: $CONTAINER_NAME..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
    log "Old container removed."
else
    log "No existing container named '$CONTAINER_NAME' found."
fi

# Build the Docker image with a timestamp as the tag
timestamp=$(date +%Y%m%d%H%M%S)
log "Building new Docker image with tag: backend:$timestamp..."
docker build -t backend:$timestamp .

# Run the new container
# --network host: Connects directly to localhost MySQL
# --env-file app.env: Injects the password securely from the file
# --name: Assigns the name so we can stop it easily next time
log "Running new Docker container..."
docker run -d \
  --restart unless-stopped \
  --network host \
  --name $CONTAINER_NAME \
  --env-file app.env \
  backend:$timestamp dotnet backend.dll

# Reload Nginx (Optional for backend changes, but good practice)
log "Reloading Nginx..."
sudo systemctl reload nginx

log "Deployment completed successfully."