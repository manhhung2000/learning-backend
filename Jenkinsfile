pipeline {
    agent any

    environment {
        AWS_REGION      = 'us-east-1'
        AWS_ACCOUNT_ID  = '114490782458'
        EC2_USER        = 'ec2-user'
        EC2_HOST        = '34.207.170.82'

        // Backend
        ECR_REPO        = 'learning-backend'
        APP_PORT        = '4000'

        // Frontend
        ECR_REPO_FE              = 'learning-frontend'
        FE_PORT                  = '3000'
        NEXT_PUBLIC_API_URL      = 'https://zs1j8s453i.execute-api.us-east-1.amazonaws.com'
        NEXT_PUBLIC_COGNITO_REGION         = 'us-east-1'
        NEXT_PUBLIC_COGNITO_USER_POOL_ID   = 'us-east-1_H0rvcG4L9'
        NEXT_PUBLIC_COGNITO_CLIENT_ID      = 'gi0hd9dka68i4mj125lbck65'
        NEXT_PUBLIC_DOMAIN                 = 'ec2-34-207-170-82.compute-1.amazonaws.com'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins tự clone repo từ GitHub (đã cấu hình ở SCM)
                checkout scm
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                    sh 'npm run test'
                }
            }
        }

        stage('Build & Push ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh '''
                        ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                        ECR_IMAGE="${ECR_REGISTRY}/${ECR_REPO}"

                        # Login ECR
                        aws ecr get-login-password --region $AWS_REGION \
                            | docker login --username AWS --password-stdin $ECR_REGISTRY

                        # Build
                        docker build \
                            -f backend/devops/docker/Dockerfile \
                            --target production \
                            -t $ECR_IMAGE:latest \
                            ./backend

                        # Push
                        docker push $ECR_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'PEM'
                    ),
                    [$class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials']
                ]) {
                    sh """
                        ssh -i \$PEM -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            ECR_REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                            ECR_IMAGE=\$ECR_REGISTRY/${ECR_REPO}

                            aws ecr get-login-password --region ${AWS_REGION} \\
                                | docker login --username AWS --password-stdin \$ECR_REGISTRY

                            docker rm -f api
                            docker pull \$ECR_IMAGE:latest
                            docker run -d \\
                                --name api \\
                                --network compose_default \\
                                --env-file ~/backend/.env.production \\
                                -e DB_HOST=db \\
                                -e REDIS_HOST=redis \\
                                -e NODE_ENV=production \\
                                -p ${APP_PORT}:${APP_PORT} \\
                                --restart always \\
                                \$ECR_IMAGE:latest
                        '
                    """
                }
            }
        }

        stage('Build & Push ECR (Frontend)') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh """
                        ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                        ECR_IMAGE="\$ECR_REGISTRY/${ECR_REPO_FE}"

                        aws ecr get-login-password --region ${AWS_REGION} \\
                            | docker login --username AWS --password-stdin \$ECR_REGISTRY

                        docker build \\
                            -f frontend/devops/docker/Dockerfile \\
                            --target production \\
                            --build-arg CACHEBUST=\$(date +%s) \\
                            --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \\
                            --build-arg NEXT_PUBLIC_COGNITO_REGION=${NEXT_PUBLIC_COGNITO_REGION} \\
                            --build-arg NEXT_PUBLIC_COGNITO_USER_POOL_ID=${NEXT_PUBLIC_COGNITO_USER_POOL_ID} \\
                            --build-arg NEXT_PUBLIC_COGNITO_CLIENT_ID=${NEXT_PUBLIC_COGNITO_CLIENT_ID} \\
                            --build-arg NEXT_PUBLIC_DOMAIN=${NEXT_PUBLIC_DOMAIN} \\
                            -t \$ECR_IMAGE:latest \\
                            ./frontend

                        docker push \$ECR_IMAGE:latest
                    """
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'PEM'
                    ),
                    [$class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials']
                ]) {
                    sh """
                        ssh -i \$PEM -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            ECR_REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                            ECR_IMAGE=\$ECR_REGISTRY/${ECR_REPO_FE}

                            aws ecr get-login-password --region ${AWS_REGION} \\
                                | docker login --username AWS --password-stdin \$ECR_REGISTRY

                            docker rm -f frontend
                            docker pull \$ECR_IMAGE:latest
                            docker run -d \\
                                --name frontend \\
                                --network compose_default \\
                                --env-file ~/frontend/.env.production \\
                                -e PORT=${FE_PORT} \\
                                -p ${FE_PORT}:${FE_PORT} \\
                                --restart always \\
                                \$ECR_IMAGE:latest
                        '
                    """
                }
            }
        }

        stage('Clean') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo 'Deploy thành công!'
        }
        failure {
            echo 'Pipeline thất bại — kiểm tra Console Output.'
        }
    }
}
