APP_NAME = puppeteer
APP_VERSION = latest

AWS_ECR_ACCOUNT_ID = 654654292838
AWS_ECR_REGION = eu-central-1
AWS_ECR_REPO = development-$(APP_NAME)-image-repository

TAG ?= $(APP_VERSION)

docker/build:
	docker build -t $(APP_NAME):$(APP_VERSION) .

docker/push:
	make docker/build
	aws ecr get-login-password --region $(AWS_ECR_REGION) | docker login --username AWS --password-stdin $(AWS_ECR_ACCOUNT_ID).dkr.ecr.$(AWS_ECR_REGION).amazonaws.com
	docker tag $(APP_NAME):$(APP_VERSION) $(AWS_ECR_ACCOUNT_ID).dkr.ecr.$(AWS_ECR_REGION).amazonaws.com/$(AWS_ECR_REPO):$(TAG)
	docker push $(AWS_ECR_ACCOUNT_ID).dkr.ecr.$(AWS_ECR_REGION).amazonaws.com/$(AWS_ECR_REPO):$(TAG)

docker/run:
	docker run -p 9000:8080 $(APP_NAME):$(APP_VERSION)

docker/test :
	curl -XPOST 'http://localhost:9000/2015-03-31/functions/function/invocations' -d '{ "url": "https://google.be" }'
