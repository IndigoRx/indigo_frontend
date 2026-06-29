pipeline {
    agent any

    environment {
        IMAGE_NAME = 'indigo_frontend'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'indigo_frontend_app'
        APP_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:3000 \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Health Check') {
            steps {
                sh "sleep 5 && docker ps --filter name=${CONTAINER_NAME} --filter status=running | grep ${CONTAINER_NAME}"
            }
        }
    }

    post {
        success {
            echo "Deployment successful — ${IMAGE_NAME}:${IMAGE_TAG} running on port ${APP_PORT}"
        }
        failure {
            sh "docker logs ${CONTAINER_NAME} || true"
            echo "Deployment failed. Check logs above."
        }
        always {
            sh "docker image prune -f || true"
        }
    }
}
