#!/bin/bash

# TalentSync Kubernetes Deployment Script
# This script deploys the entire TalentSync application on minikube

echo "=========================================="
echo "TalentSync Kubernetes Deployment"
echo "=========================================="

# Check if minikube is running
echo "Checking minikube status..."
minikube status || { echo "Starting minikube..."; minikube start --driver=docker; }

# Enable metrics-server addon for HPA
echo "Enabling metrics-server addon..."
minikube addons enable metrics-server

# Set docker environment to use minikube's docker daemon
echo "Setting up Docker environment for minikube..."
eval $(minikube docker-env)

# Build Docker images
echo "Building backend Docker image..."
cd /home/ubuntu/TalentSync/server
docker build -t talentsync-backend:latest .

echo "Building frontend Docker image..."
cd /home/ubuntu/TalentSync/client
docker build -t talentsync-frontend:latest .

# Go to k8s directory
cd /home/ubuntu/TalentSync/k8s

# Apply MongoDB resources
echo "Deploying MongoDB..."
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb --timeout=120s

# Apply Backend resources
echo "Deploying Backend..."
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Wait for Backend to be ready
echo "Waiting for Backend to be ready..."
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

# Apply Frontend resources
echo "Deploying Frontend..."
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# Wait for Frontend to be ready
echo "Waiting for Frontend to be ready..."
kubectl wait --for=condition=ready pod -l app=frontend --timeout=120s

# Apply HorizontalPodAutoscaler
echo "Applying HorizontalPodAutoscaler..."
kubectl apply -f hpa.yaml

echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="

# Display service URLs
echo ""
echo "Services:"
echo "MongoDB NodePort: $(minikube service mongodb-service --url)"
echo "Backend NodePort: $(minikube service backend-service --url)"
echo "Frontend NodePort: $(minikube service frontend-service --url)"

echo ""
echo "To access the dashboard, run: minikube dashboard"
echo ""
echo "Checking all resources..."
kubectl get all
kubectl get pvc
kubectl get hpa
