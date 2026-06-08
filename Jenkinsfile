pipeline {
    agent any
    environment {
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        DOCKERHUB_PASSWORD = credentials('dockerhub-password')
        DOCKER_REPO = 'previsetech/previselab-web-app'
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install & Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
                sh 'cd server && npm ci && npm test'
            }
        }
        stage('Build Frontend') {
            steps { sh 'npm run build' }
        }
        stage('Generate Image Tag') {
            steps {
                script {
                    def branch = env.BRANCH_NAME.replaceAll('/', '-')
                    def timestamp = new Date().format('yyyyMMdd-HHmmss')
                    env.IMAGE_TAG = "${branch}-${timestamp}"
                }
            }
        }
        stage('Docker Build & Push') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release*'
                    branch 'main'
                    branch 'hotfix*'
                }
            }
            steps {
                sh """
                    echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin
                    docker build -t ${DOCKER_REPO}:${IMAGE_TAG} .
                    docker push ${DOCKER_REPO}:${IMAGE_TAG}
                """
            }
        }
        stage('Deploy to Dev') {
            when { branch 'develop' }
            steps {
                sh """
                    sed -i 's/name: landmark/name: develop/g' k8s/namespace.yml
                    kubectl apply -f k8s/namespace.yml
                    sed -i 's/namespace: landmark/namespace: develop/g' k8s/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/develop --timeout=30s
                    kubectl apply -f k8s/
                """
            }
        }
        stage('Deploy to Staging') {
            when { branch pattern: 'release*', comparator: 'GLOB' }
            steps {
                sh """
                    sed -i 's/name: landmark/name: staging/g' k8s/namespace.yml
                    kubectl apply -f k8s/namespace.yml
                    sed -i 's/namespace: landmark/namespace: staging/g' k8s/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/staging --timeout=30s
                    kubectl apply -f k8s/
                """
            }
        }
        stage('Deploy to Production') {
            when {
                anyOf {
                    branch 'main'
                    branch pattern: 'hotfix*', comparator: 'GLOB'
                }
            }
            steps {
                sh """
                    sed -i 's/name: landmark/name: production/g' k8s/namespace.yml
                    kubectl apply -f k8s/namespace.yml
                    sed -i 's/namespace: landmark/namespace: production/g' k8s/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/production --timeout=30s
                    kubectl apply -f k8s/
                """
            }
        }
    }
    post {
        failure { echo 'Pipeline failed!' }
        success { echo 'Pipeline succeeded!' }
    }
}
