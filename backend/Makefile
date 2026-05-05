include .env.production

ECR_REGISTRY = $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
ECR_IMAGE = $(ECR_REGISTRY)/$(ECR_REPO)
EC2_USER = ec2-user
EC2_HOST = 34.229.207.207
PEM = /Users/admin/Desktop/pem/learning-backend-key.pem
SSH = ssh -i $(PEM) $(EC2_USER)@$(EC2_HOST)

login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REGISTRY)

build:
	docker-compose -f devops/compose/docker-compose.prd.yml --env-file .env.production build

push:
	docker tag learning-backend:latest $(ECR_IMAGE):latest
	docker push $(ECR_IMAGE):latest

sync-env:
	scp -i $(PEM) .env.production $(EC2_USER)@$(EC2_HOST):~/backend/.env.production

restart:
	$(SSH) "aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REGISTRY) && docker rm -f api && docker pull $(ECR_IMAGE):latest && docker run -d --name api --network compose_default --env-file ~/backend/.env.production -e DB_HOST=db -e REDIS_HOST=redis -e NODE_ENV=production -p $(PORT):$(PORT) --restart always $(ECR_IMAGE):latest"

clean:
	docker image prune -f

deploy: login build push sync-env restart clean
