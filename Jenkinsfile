pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
        NODE_ENV = 'production'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                script {
                    dir('client') {
                        sh 'npm install --legacy-peer-deps || npm install'
                    }
                    dir('server') {
                        sh 'npm install'
                    }
                }
            }
        }
        
        stage('Build Client') {
            steps {
                echo 'Building React client...'
                dir('client') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Skipping Selenium tests in CI/CD pipeline...'
                echo 'Note: Run tests manually with: mvn clean test'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker compose build --no-cache'
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                echo 'Stopping old containers...'
                sh 'docker compose down || true'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application with Docker Compose...'
                sh 'docker compose up -d'
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health check...'
                sh 'sleep 30'
                script {
                    sh 'curl -f http://localhost:80/ || exit 1'
                    sh 'curl -f http://localhost:5000/api/jobs || exit 1'
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Deployment successful! Application is running.'
        }
        failure {
            echo '❌ Deployment failed! Checking logs...'
            sh 'docker compose logs --tail=100 || true'
        }
        always {
            echo 'Cleaning up unused Docker resources...'
            sh 'docker system prune -f || true'
        }
    }
}
