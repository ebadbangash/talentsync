pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials' // You'll need to add these in Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Build Client') {
            steps {
                echo 'Building React client...'
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Server') {
            steps {
                echo 'Building Node.js server...'
                dir('server') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker compose build'
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
                echo 'Deploying application...'
                sh 'docker compose up -d'
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health check...'
                sh 'sleep 15'
                sh ' curl  http://ec2-98-92-69-131.compute-1.amazonaws.com/ || exit 1'
                sh 'curl  http://ec2-98-92-69-131.compute-1.amazonaws.com/api/jobs || exit 1'
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
            sh 'docker compose logs || true'
        }
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f'
        }
    }
}
