
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
        
        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests in Docker container against deployed app...'
                script {
                    docker.image('markhobson/maven-chrome:latest').inside('-u root:root -v /var/lib/jenkins/.m2:/root/.m2 --network host') {
                        dir('selenium-tests') {
                            sh 'mvn clean test || true'
                        }
                    }
                }
            }
        }
        
        stage('Publish Test Results') {
            steps {
                echo 'Publishing JUnit test results...'
                junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
            }
        }
    }
    
    post {
        always {
            script {
                // Get commit author email
                sh "git config --global --add safe.directory ${env.WORKSPACE}"
                def committer = sh(
                    script: "git log -1 --pretty=format:'%ae'",
                    returnStdout: true
                ).trim()

                def testResults = ""
                def total = 0
                def passed = 0
                def failed = 0
                def skipped = 0

                try {
                    def raw = sh(
                        script: "grep -h \"<testcase\" selenium-tests/target/surefire-reports/*.xml || echo ''",
                        returnStdout: true
                    ).trim()

                    if (raw) {
                        raw.split('\n').each { line ->
                            if (line && line.contains('testcase')) {
                                total++

                                def nameMatcher = (line =~ /name=\"([^\"]+)\"/)
                                def name = nameMatcher ? nameMatcher[0][1] : "Unknown Test"

                                if (line.contains("<failure")) {
                                    failed++
                                    testResults += "❌ ${name} — FAILED\n"
                                } else if (line.contains("<skipped") || line.contains("</skipped>")) {
                                    skipped++
                                    testResults += "⏭️  ${name} — SKIPPED\n"
                                } else {
                                    passed++
                                    testResults += "✅ ${name} — PASSED\n"
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    testResults = "No test results found or error parsing results.\n"
                }

                def buildStatus = currentBuild.result ?: 'SUCCESS'
                def statusIcon = buildStatus == 'SUCCESS' ? '✅' : '❌'

                def emailBody = """
${statusIcon} TalentSync CI/CD Pipeline - Build #${env.BUILD_NUMBER}

Build Status: ${buildStatus}
Branch: ${env.GIT_BRANCH ?: 'main'}
Commit: ${env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SELENIUM TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests:   ${total}
Passed:        ${passed} ✅
Failed:        ${failed} ❌
Skipped:       ${skipped} ⏭️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DETAILED TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${testResults ?: 'No tests were executed.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 BUILD INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build URL: ${env.BUILD_URL}
Console Output: ${env.BUILD_URL}console
Test Report: ${env.BUILD_URL}testReport/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an automated message from Jenkins CI/CD Pipeline.
"""

                emailext(
                    to: committer,
                    subject: "${statusIcon} TalentSync Build #${env.BUILD_NUMBER} - ${buildStatus}",
                    body: emailBody,
                    mimeType: 'text/plain'
                )
                
                echo "📧 Test results email sent to: ${committer}"
            }
        }
        success {
            echo '✅ Deployment successful! Application is running.'
        }
        failure {
            echo '❌ Deployment failed! Checking logs...'
            sh 'docker compose logs --tail=100 || true'
        }
        cleanup {
            echo 'Cleaning up unused Docker resources...'
            sh 'docker system prune -f || true'
        }
    }
}
