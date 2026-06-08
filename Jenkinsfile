pipeline {
    agent any
    environment {
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        DOCKERHUB_PASSWORD = credentials('dockerhub-password')
        DOCKER_REPO        = 'previsetech/previselab-web-app'
        TAILSCALE_AUTHKEY  = credentials('tailscale-authkey')
        KUBE_SERVER        = credentials('kube-server')
        KUBE_TOKEN         = credentials('kube-token')
        TAILSCALE_NODE_IP  = credentials('tailscale-node-ip')
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
                    branch pattern: 'release*', comparator: 'GLOB'
                    branch 'main'
                    branch pattern: 'hotfix*', comparator: 'GLOB'
                }
            }
            steps {
                sh """
                    echo \$DOCKERHUB_PASSWORD | docker login -u \$DOCKERHUB_USERNAME --password-stdin
                    docker build -t ${DOCKER_REPO}:${IMAGE_TAG} .
                    docker push ${DOCKER_REPO}:${IMAGE_TAG}
                """
            }
        }
        stage('Deploy to Dev') {
            when { branch 'develop' }
            steps {
                sh """
                    curl -LO "https://dl.k8s.io/release/\$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                    chmod +x kubectl && sudo mv kubectl /usr/local/bin/
                    curl -fsSL https://tailscale.com/install.sh | sh
                    sudo tailscale up --authkey=\$TAILSCALE_AUTHKEY --accept-routes

                    kubectl config set-cluster self-managed --server=\$KUBE_SERVER --insecure-skip-tls-verify=true
                    kubectl config set-credentials jenkins-runner-sa --token=\$KUBE_TOKEN
                    kubectl config set-context jenkins-context --cluster=self-managed --user=jenkins-runner-sa
                    kubectl config use-context jenkins-context
                    kubectl cluster-info

                    sed -i 's/name: landmark/name: develop/g' k8s/namespace.yml
                    kubectl apply -f k8s/namespace.yml
                    sed -i 's/namespace: landmark/namespace: develop/g' k8s/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
                    sed -i "s|INGRESS_HOST|develop.${TAILSCALE_NODE_IP}.nip.io|g" k8s/ingress.yml
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/develop --timeout=30s
                    CURRENT_SC=\$(kubectl get pvc mongo-pvc -n develop -o jsonpath='{.spec.storageClassName}' 2>/dev/null || echo "")
                    if [ -n "\$CURRENT_SC" ] && [ "\$CURRENT_SC" != "local-path" ]; then
                      kubectl delete deployment mongo -n develop --ignore-not-found
                      kubectl delete pvc mongo-pvc -n develop
                    fi
                    kubectl apply -f k8s/
                """
            }
        }
        stage('Deploy to Staging') {
            when { branch pattern: 'release*', comparator: 'GLOB' }
            steps {
                sh """
                    curl -LO "https://dl.k8s.io/release/\$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                    chmod +x kubectl && sudo mv kubectl /usr/local/bin/
                    curl -fsSL https://tailscale.com/install.sh | sh
                    sudo tailscale up --authkey=\$TAILSCALE_AUTHKEY --accept-routes

                    kubectl config set-cluster self-managed --server=\$KUBE_SERVER --insecure-skip-tls-verify=true
                    kubectl config set-credentials jenkins-runner-sa --token=\$KUBE_TOKEN
                    kubectl config set-context jenkins-context --cluster=self-managed --user=jenkins-runner-sa
                    kubectl config use-context jenkins-context
                    kubectl cluster-info

                    sed -i 's/name: landmark/name: staging/g' k8s/namespace.yml
                    kubectl apply -f k8s/namespace.yml
                    sed -i 's/namespace: landmark/namespace: staging/g' k8s/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
                    sed -i "s|INGRESS_HOST|staging.${TAILSCALE_NODE_IP}.nip.io|g" k8s/ingress.yml
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/staging --timeout=30s
                    CURRENT_SC=\$(kubectl get pvc mongo-pvc -n staging -o jsonpath='{.spec.storageClassName}' 2>/dev/null || echo "")
                    if [ -n "\$CURRENT_SC" ] && [ "\$CURRENT_SC" != "local-path" ]; then
                      kubectl delete deployment mongo -n staging --ignore-not-found
                      kubectl delete pvc mongo-pvc -n staging
                    fi
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
                    curl -LO "https://dl.k8s.io/release/\$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                    chmod +x kubectl && sudo mv kubectl /usr/local/bin/
                    curl -fsSL https://tailscale.com/install.sh | sh
                    sudo tailscale up --authkey=\$TAILSCALE_AUTHKEY --accept-routes

                    kubectl config set-cluster self-managed --server=\$KUBE_SERVER --insecure-skip-tls-verify=true
                    kubectl config set-credentials jenkins-runner-sa --token=\$KUBE_TOKEN
                    kubectl config set-context jenkins-context --cluster=self-managed --user=jenkins-runner-sa
                    kubectl config use-context jenkins-context
                    kubectl cluster-info

                    sed -i 's/name: landmark/name: production/g' k8s/namespace.yml
                    kubectl apply -f k8s/namespace.yml
                    sed -i 's/namespace: landmark/namespace: production/g' k8s/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s/app-deployment.yml
                    sed -i "s|INGRESS_HOST|${TAILSCALE_NODE_IP}.nip.io|g" k8s/ingress.yml
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/production --timeout=30s
                    CURRENT_SC=\$(kubectl get pvc mongo-pvc -n production -o jsonpath='{.spec.storageClassName}' 2>/dev/null || echo "")
                    if [ -n "\$CURRENT_SC" ] && [ "\$CURRENT_SC" != "local-path" ]; then
                      kubectl delete deployment mongo -n production --ignore-not-found
                      kubectl delete pvc mongo-pvc -n production
                    fi
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
