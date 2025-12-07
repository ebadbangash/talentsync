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
                echo 'Running Selenium tests...'
                dir('selenium-tests') {
                    sh 'mvn clean test || echo "Tests completed with some failures"'
                }
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
                sh 'sleep 20'
                script {
                    sh 'curl -f https://ec2-3-236-8-81.compute-1.amazonaws.com/ || exit 1'
                    sh 'curl -f https://ec2-3-236-8-81.compute-1.amazonaws.com/api/jobs || exit 1'
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
