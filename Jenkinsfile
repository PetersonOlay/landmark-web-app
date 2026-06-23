// Returns the current timestamp as a formatted string.
// Declared @NonCPS so java.util.Date is never held in a CPS-serializable pipeline context.
@NonCPS
def buildTimestamp() {
    return new Date().format('yyyyMMdd-HHmmss')
}

// Installs kubectl, connects to the private cluster via Tailscale VPN,
// and configures the jenkins-runner-sa kubeconfig context.
// Shared across all three deploy stages to avoid repetition.
def deploySetup() {
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
    """
}

pipeline {
    agent any

    // Jenkins credentials — configure these in Manage Jenkins → Credentials
    environment {
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        DOCKERHUB_PASSWORD = credentials('dockerhub-password')
        DOCKER_REPO        = 'previsetech/previselab-web-app'
        TAILSCALE_AUTHKEY  = credentials('tailscale-authkey')   // Tailscale ephemeral auth key
        KUBE_SERVER        = credentials('kube-server')          // https://<tailscale-ip>:6443
        KUBE_TOKEN         = credentials('kube-token')           // jenkins-runner-sa service account token
    }

    stages {

        // Pull latest source from the configured SCM branch
        stage('Checkout') {
            steps { checkout scm }
        }

        // Enforce Git Flow rules for Pull Requests targeting the production branch.
        // Fails the build early if the source branch is not 'release/*' or 'hotfix/*'.
        stage('Git Flow Guard') {
            when {
                // Only evaluates when a Pull Request targets 'main'
                changeRequest target: 'main'
            }
            steps {
                script {
                    def sourceBranch = env.CHANGE_BRANCH
                    echo "Incoming Pull Request targeting 'main' from branch: ${sourceBranch}"

                    if (sourceBranch.startsWith("release/") || sourceBranch.startsWith("hotfix/")) {
                        echo "SUCCESS: '${sourceBranch}' is a valid source branch for production."
                    } else {
                        currentBuild.result = 'FAILURE'
                        error("DEVOPS ERROR: Cannot merge '${sourceBranch}' directly into main. " +
                              "Under Git Flow, main only accepts PRs from 'release/*' or 'hotfix/*' branches.")
                    }
                }
            }
        }

        // Install Node.js 18 via nodesource if not already present on the agent
        stage('Setup Node.js') {
            steps {
                sh '''
                    if ! command -v node > /dev/null 2>&1; then
                        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    fi
                    node --version
                    npm --version
                '''
            }
        }

        // Install dependencies and run unit tests for both the frontend and the server
        stage('Install & Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
                sh 'cd server && npm ci && npm test'
            }
        }

        // Compile the React frontend into a production build
        stage('Build Frontend') {
            steps { sh 'npm run build' }
        }

        // Derive the branch name and generate a unique image tag in the form <branch>-<timestamp>.
        // Falls back through: BRANCH_NAME (multibranch pipeline) → GIT_BRANCH (standard pipeline)
        // → git name-rev (detached HEAD / manually triggered builds).
        // Placed before the deploy stages so env.GIT_BRANCH_NAME is set before any 'when' block evaluates.
        stage('Generate Image Tag') {
            steps {
                script {
                    def rawBranch = env.BRANCH_NAME \
                        ?: env.GIT_BRANCH?.replaceAll('origin/', '') \
                        ?: sh(script: 'git name-rev --name-only HEAD | sed "s|remotes/origin/||; s|~.*||"', returnStdout: true).trim()
                    env.GIT_BRANCH_NAME = rawBranch
                    env.IMAGE_TAG = "${rawBranch.replaceAll('/', '-')}-${buildTimestamp()}"
                }
            }
        }

        // Build the Docker image and push it to Docker Hub.
        // Only runs on branches that will be deployed: develop, main, release/*, hotfix/*
        stage('Docker Build & Push') {
            when {
                expression {
                    def b = env.GIT_BRANCH_NAME ?: ''
                    return b == 'develop' || b == 'main' || b.startsWith('release/') || b.startsWith('hotfix/')
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

        // Deploy to the develop namespace — triggered by the develop branch
        stage('Deploy to Dev') {
            when { expression { env.GIT_BRANCH_NAME == 'develop' } }
            steps {
                // Connect to the cluster and configure kubectl
                script { deploySetup() }
                sh """
                    # Copy manifests to a temp directory so the workspace originals stay clean.
                    # This ensures the placeholder values are available on every pipeline run.
                    rm -rf k8s-patched && cp -r k8s/ k8s-patched/

                    # Substitute namespace name, image tag, and ingress host in the copied manifests
                    sed -i 's/name: landmark/name: develop/g' k8s-patched/namespace.yml
                    kubectl apply -f k8s-patched/namespace.yml
                    sed -i 's/namespace: landmark/namespace: develop/g' k8s-patched/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s-patched/app-deployment.yml
                    sed -i "s|INGRESS_HOST|develop.cobia-codlet.ts.net|g" k8s-patched/ingress.yml

                    # Wait for the namespace to become active before applying workloads
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/develop --timeout=30s

                    # Delete the mongo PVC if its storageClassName has changed (immutable field)
                    CURRENT_SC=\$(kubectl get pvc mongo-pvc -n develop -o jsonpath='{.spec.storageClassName}' 2>/dev/null || echo "")
                    if [ -n "\$CURRENT_SC" ] && [ "\$CURRENT_SC" != "local-path" ]; then
                      kubectl delete deployment mongo -n develop --ignore-not-found
                      kubectl delete pvc mongo-pvc -n develop
                    fi

                    kubectl apply -f k8s-patched/
                """
            }
        }

        // Deploy to the staging namespace — triggered by release/* branches
        stage('Deploy to Staging') {
            when { expression { env.GIT_BRANCH_NAME?.startsWith('release/') } }
            steps {
                // Connect to the cluster and configure kubectl
                script { deploySetup() }
                sh """
                    # Copy manifests to a temp directory so the workspace originals stay clean
                    rm -rf k8s-patched && cp -r k8s/ k8s-patched/

                    # Substitute namespace name, image tag, and ingress host in the copied manifests
                    sed -i 's/name: landmark/name: staging/g' k8s-patched/namespace.yml
                    kubectl apply -f k8s-patched/namespace.yml
                    sed -i 's/namespace: landmark/namespace: staging/g' k8s-patched/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s-patched/app-deployment.yml
                    sed -i "s|INGRESS_HOST|staging.cobia-codlet.ts.net|g" k8s-patched/ingress.yml

                    # Wait for the namespace to become active before applying workloads
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/staging --timeout=30s

                    # Delete the mongo PVC if its storageClassName has changed (immutable field)
                    CURRENT_SC=\$(kubectl get pvc mongo-pvc -n staging -o jsonpath='{.spec.storageClassName}' 2>/dev/null || echo "")
                    if [ -n "\$CURRENT_SC" ] && [ "\$CURRENT_SC" != "local-path" ]; then
                      kubectl delete deployment mongo -n staging --ignore-not-found
                      kubectl delete pvc mongo-pvc -n staging
                    fi

                    kubectl apply -f k8s-patched/
                """
            }
        }

        // Deploy to the production namespace — triggered by main or hotfix/* branches
        stage('Deploy to Production') {
            when {
                expression {
                    def b = env.GIT_BRANCH_NAME ?: ''
                    return b == 'main' || b.startsWith('hotfix/')
                }
            }
            steps {
                // Connect to the cluster and configure kubectl
                script { deploySetup() }
                sh """
                    # Copy manifests to a temp directory so the workspace originals stay clean
                    rm -rf k8s-patched && cp -r k8s/ k8s-patched/

                    # Substitute namespace name, image tag, and ingress host in the copied manifests
                    sed -i 's/name: landmark/name: production/g' k8s-patched/namespace.yml
                    kubectl apply -f k8s-patched/namespace.yml
                    sed -i 's/namespace: landmark/namespace: production/g' k8s-patched/*.yml
                    sed -i "s|image: ${DOCKER_REPO}:.*|image: ${DOCKER_REPO}:${IMAGE_TAG}|g" k8s-patched/app-deployment.yml
                    sed -i "s|INGRESS_HOST|production.cobia-codlet.ts.net|g" k8s-patched/ingress.yml

                    # Wait for the namespace to become active before applying workloads
                    kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/production --timeout=30s

                    # Delete the mongo PVC if its storageClassName has changed (immutable field)
                    CURRENT_SC=\$(kubectl get pvc mongo-pvc -n production -o jsonpath='{.spec.storageClassName}' 2>/dev/null || echo "")
                    if [ -n "\$CURRENT_SC" ] && [ "\$CURRENT_SC" != "local-path" ]; then
                      kubectl delete deployment mongo -n production --ignore-not-found
                      kubectl delete pvc mongo-pvc -n production
                    fi

                    kubectl apply -f k8s-patched/
                """
            }
        }
    }

    post {
        failure { echo 'Pipeline failed!' }
        success { echo 'Pipeline succeeded!' }
    }
}
