#!/bin/bash

# ngrok Tunnel Script for TalentSync
# This script exposes the web application and minikube dashboard externally

echo "=========================================="
echo "TalentSync ngrok Tunnel Setup"
echo "=========================================="

# Check if ngrok is authenticated
if ! ngrok config check > /dev/null 2>&1; then
    echo "Please authenticate ngrok first:"
    echo "ngrok config add-authtoken YOUR_AUTH_TOKEN"
    exit 1
fi

# Get the minikube IP
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"

# Get service ports
FRONTEND_PORT=30080
DASHBOARD_PORT=0

# Start minikube dashboard in background and get the URL
echo "Starting minikube dashboard..."
minikube dashboard --url > /tmp/dashboard_url.txt 2>&1 &
sleep 5

# Extract dashboard port
DASHBOARD_URL=$(cat /tmp/dashboard_url.txt | grep -oP 'http://[0-9.:]+')
DASHBOARD_PORT=$(echo $DASHBOARD_URL | grep -oP ':\K[0-9]+')

echo ""
echo "Starting ngrok tunnels..."
echo ""

# Create ngrok configuration file for multiple tunnels
cat > /tmp/ngrok.yml << EOF
version: "2"
tunnels:
  frontend:
    addr: ${MINIKUBE_IP}:${FRONTEND_PORT}
    proto: http
  dashboard:
    addr: ${DASHBOARD_URL}
    proto: http
EOF

echo "ngrok configuration created."
echo ""
echo "To expose the services, run ngrok with multiple tunnels:"
echo ""
echo "Option 1 - Using ngrok config (requires paid plan for multiple tunnels):"
echo "  ngrok start --config /tmp/ngrok.yml --all"
echo ""
echo "Option 2 - Run two separate ngrok instances (free plan):"
echo ""
echo "Terminal 1 (Frontend):"
echo "  ngrok http ${MINIKUBE_IP}:${FRONTEND_PORT}"
echo ""
echo "Terminal 2 (Dashboard):"
echo "  First, get dashboard URL: minikube dashboard --url"
echo "  Then run: ngrok http <dashboard-url>"
echo ""
echo "=========================================="
echo "Service Details:"
echo "=========================================="
echo "Frontend Service: http://${MINIKUBE_IP}:${FRONTEND_PORT}"
echo "Backend Service:  http://${MINIKUBE_IP}:30500"
echo "MongoDB Service:  http://${MINIKUBE_IP}:30017"
echo "Dashboard URL:    ${DASHBOARD_URL}"
echo ""
