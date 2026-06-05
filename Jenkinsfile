pipeline {
    agent any
    environment {
        ECR_REGISTRY = credentials('ecr-registry')
        AWS_REGION = 'us-east-1'
        EKS_CLUSTER = 'landmark-eks'
        DOCKER_REPO = 'chafah/landmark-web-app'
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
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    docker build -t ${ECR_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG} .
                    docker push ${ECR_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}
                """
            }
        }
        stage('Deploy to Dev') {
            when { branch 'develop' }
            steps {
                sh """
                    aws eks update-kubeconfig --name ${EKS_CLUSTER} --region ${AWS_REGION}
                    sed -i 's/namespace: landmark/namespace: develop/g' k8s/*.yml
                    sed -i "s|image: landmark-technologies:latest|image: ${ECR_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
                    kubectl apply -f k8s/
                """
            }
        }
        stage('Deploy to Staging') {
            when { branch pattern: 'release*', comparator: 'GLOB' }
            steps {
                sh """
                    aws eks update-kubeconfig --name ${EKS_CLUSTER} --region ${AWS_REGION}
                    sed -i 's/namespace: landmark/namespace: staging/g' k8s/*.yml
                    sed -i "s|image: landmark-technologies:latest|image: ${ECR_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
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
                    aws eks update-kubeconfig --name ${EKS_CLUSTER} --region ${AWS_REGION}
                    sed -i 's/namespace: landmark/namespace: production/g' k8s/*.yml
                    sed -i "s|image: landmark-technologies:latest|image: ${ECR_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
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
