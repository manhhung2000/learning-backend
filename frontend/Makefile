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
	CACHEBUST=$(shell date +%s) docker-compose -f devops/compose/docker-compose.prd.yml --env-file .env.production build

push:
	docker push $(ECR_IMAGE):latest

sync-env:
	scp -i $(PEM) .env.production $(EC2_USER)@$(EC2_HOST):~/frontend/.env.production

restart:
	$(SSH) "aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REGISTRY) && docker rm -f frontend && docker pull $(ECR_IMAGE):latest && docker run -d --name frontend --network compose_default --env-file ~/frontend/.env.production -e PORT=$(FRONTEND_PORT) -p $(FRONTEND_PORT):$(FRONTEND_PORT) --restart always $(ECR_IMAGE):latest"

clean:
	docker image prune -f

deploy: login build push sync-env restart clean
