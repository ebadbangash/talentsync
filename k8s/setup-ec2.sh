#!/bin/bash

# EC2 Setup Script for Minikube and Kubernetes
# Run this script on a fresh Ubuntu EC2 instance

echo "=========================================="
echo "EC2 Setup for Minikube"
echo "=========================================="

# Update system
echo "Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
echo "Installing Docker..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER

# Install kubectl
echo "Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

# Install minikube
echo "Installing minikube..."
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64

# Install Node.js (for building the app)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install ngrok
echo "Installing ngrok..."
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt-get update -y
sudo apt-get install -y ngrok

# Install conntrack (required for minikube)
echo "Installing conntrack..."
sudo apt-get install -y conntrack

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "IMPORTANT: Please log out and log back in for docker group changes to take effect."
echo ""
echo "After logging back in, run the following commands:"
echo "1. minikube start --driver=docker"
echo "2. Clone your repository"
echo "3. Run the deploy-all.sh script"
echo ""
echo "For ngrok setup:"
echo "1. Sign up at https://ngrok.com and get your auth token"
echo "2. Run: ngrok config add-authtoken YOUR_AUTH_TOKEN"
