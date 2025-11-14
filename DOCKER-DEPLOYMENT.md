# TalentSync Docker Deployment Guide

This guide covers running TalentSync locally with Docker and deploying to AWS EC2.

## 📋 Prerequisites

- **Docker Desktop** installed and running
- **Docker Compose** (included with Docker Desktop)
- For EC2 deployment: AWS account with EC2 access

## 🚀 Local Development with Docker

### Quick Start

1. **Build and start all services:**
   ```powershell
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

3. **Stop all services:**
   ```powershell
   docker-compose down
   ```

4. **Stop and remove volumes (clean slate):**
   ```powershell
   docker-compose down -v
   ```

### Individual Service Commands

**Run in detached mode (background):**
```powershell
docker-compose up -d
```

**View logs:**
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f mongodb
```

**Rebuild specific service:**
```powershell
docker-compose up -d --build server
docker-compose up -d --build client
```

**Access container shell:**
```powershell
docker exec -it talentsync-server sh
docker exec -it talentsync-client sh
docker exec -it talentsync-mongodb mongosh talentsync
```

### Environment Variables

Edit `docker-compose.yml` to change:
- `JWT_SECRET` - Change before production deployment
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default 5000)

## 🔧 Troubleshooting Local Docker Setup

### Port Already in Use
```powershell
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill the process
Stop-Process -Id <PID> -Force
```

### MongoDB Connection Issues
```powershell
# Check MongoDB is healthy
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Clear Everything and Start Fresh
```powershell
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove all TalentSync images
docker rmi talentsync-server talentsync-client

# Rebuild from scratch
docker-compose up --build
```

## 🌩️ EC2 Deployment

### Option 1: Deploy with Docker Compose (Recommended)

#### Step 1: Launch EC2 Instance

1. **Launch Ubuntu Server 22.04 LTS**
   - Instance type: t3.medium or larger
   - Storage: 20GB minimum
   - Security Group rules:
     - SSH (22) - Your IP
     - HTTP (80) - 0.0.0.0/0
     - HTTPS (443) - 0.0.0.0/0
     - Custom TCP (5000) - 0.0.0.0/0 (for API)

#### Step 2: Install Docker on EC2

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
exit
```

#### Step 3: Deploy Application

```bash
# Reconnect to EC2
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>

# Create app directory
mkdir -p ~/talentsync
cd ~/talentsync

# Option A: Clone from Git (recommended)
git clone <your-repo-url> .

# Option B: Copy files using SCP from local machine
# Run this from your local machine:
# scp -i your-key.pem -r d:\TalentSync/* ubuntu@<EC2-PUBLIC-IP>:~/talentsync/

# Update JWT_SECRET in docker-compose.yml
nano docker-compose.yml
# Change JWT_SECRET to a strong random string

# Start the application
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Step 4: Access Your Application

- Frontend: http://<EC2-PUBLIC-IP>
- Backend API: http://<EC2-PUBLIC-IP>:5000

### Option 2: Deploy Individual Containers

#### Backend Server

```bash
# Build backend image
cd ~/talentsync/server
docker build -t talentsync-server .

# Run backend container
docker run -d \
  --name talentsync-server \
  -p 5000:5000 \
  -e MONGO_URI="mongodb://<MONGODB-HOST>:27017/talentsync" \
  -e JWT_SECRET="your-strong-secret-here" \
  -e NODE_ENV="production" \
  --restart unless-stopped \
  talentsync-server
```

#### Frontend Client

```bash
# Build frontend image
cd ~/talentsync/client
docker build -t talentsync-client .

# Run frontend container
docker run -d \
  --name talentsync-client \
  -p 80:80 \
  --restart unless-stopped \
  talentsync-client
```

#### MongoDB

```bash
# Run MongoDB container
docker run -d \
  --name talentsync-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  --restart unless-stopped \
  mongo:6
```

### Option 3: Using Docker Hub (CI/CD Pipeline)

#### Step 1: Build and Push to Docker Hub

```powershell
# From local machine
# Login to Docker Hub
docker login

# Build images
docker build -t yourusername/talentsync-server:latest ./server
docker build -t yourusername/talentsync-client:latest ./client

# Push to Docker Hub
docker push yourusername/talentsync-server:latest
docker push yourusername/talentsync-client:latest
```

#### Step 2: Pull and Run on EC2

```bash
# On EC2 instance
docker pull yourusername/talentsync-server:latest
docker pull yourusername/talentsync-client:latest

# Run with docker-compose (update docker-compose.yml to use your images)
docker-compose up -d
```

## 🔒 Production Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Enable HTTPS with SSL certificate (use Let's Encrypt)
- [ ] Restrict MongoDB port (27017) in Security Group
- [ ] Set up firewall rules (ufw)
- [ ] Enable Docker log rotation
- [ ] Set up automatic backups for MongoDB
- [ ] Use environment variables for secrets (not hardcoded)
- [ ] Enable CloudWatch or logging service
- [ ] Set up health checks and monitoring

## 📊 Monitoring and Maintenance

### View Application Logs

```bash
# On EC2
docker-compose logs -f --tail=100

# Export logs
docker-compose logs > app-logs.txt
```

### Database Backup

```bash
# Backup MongoDB
docker exec talentsync-mongodb mongodump --out /data/backup

# Copy backup from container
docker cp talentsync-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build

# Or restart specific service
docker-compose up -d --build server
```

### Resource Monitoring

```bash
# Check container resource usage
docker stats

# Check disk usage
docker system df
```

## 🛠️ Common Issues and Solutions

### Container Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Check if port is in use
sudo netstat -tlnp | grep <port>

# Restart service
docker-compose restart <service-name>
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Out of Disk Space

```bash
# Clean up unused Docker resources
docker system prune -a

# Remove old images
docker image prune -a

# Check disk usage
df -h
```

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb://mongodb:27017/talentsync` | Yes |
| `JWT_SECRET` | Secret for JWT tokens | - | Yes |
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Environment mode | `production` | No |

## 🔄 Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/talentsync
            git pull
            docker-compose up -d --build
```

## 📞 Support

For issues or questions:
- Check logs: `docker-compose logs`
- GitHub Issues: [your-repo-url]/issues
- Documentation: See individual service README files

---

**Last Updated:** November 2025
