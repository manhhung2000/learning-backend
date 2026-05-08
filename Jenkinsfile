pipeline {
    agent any

    environment {
        AWS_REGION      = 'us-east-1'
        AWS_ACCOUNT_ID  = '114490782458'
        ECR_REPO        = 'learning-backend'
        EC2_USER        = 'ec2-user'
        EC2_HOST        = '34.207.170.82'
        APP_PORT        = '4000'
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
                    // SSH vào EC2, pull image mới và restart container
                    sh '''
                        ssh -i $PEM -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "
                            ECR_REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                            ECR_IMAGE=\$ECR_REGISTRY/${ECR_REPO}

                            aws ecr get-login-password --region ${AWS_REGION} \
                                | docker login --username AWS --password-stdin \$ECR_REGISTRY

                            docker rm -f api
                            docker pull \$ECR_IMAGE:latest
                            docker run -d \
                                --name api \
                                --network compose_default \
                                --env-file ~/backend/.env.production \
                                -e DB_HOST=db \
                                -e REDIS_HOST=redis \
                                -e NODE_ENV=production \
                                -p ${APP_PORT}:${APP_PORT} \
                                --restart always \
                                \$ECR_IMAGE:latest
                        "
                    '''
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
