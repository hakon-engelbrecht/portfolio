APP_NAME=portfolio
IMAGE_NAME=${APP_NAME}
CONTAINER_NAME=${APP_NAME}-container
PORT=3000

# default target: build and run
.PHONY: all
all: build run

# build image
.PHONY: build
build:
	docker build -t ${IMAGE_NAME} .

# run container with image
.PHONY: run
run:
	docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}

# stop the container
.PHONY: stop
stop:
	docker stop ${CONTAINER_NAME}

# remove the container
.PHONY: remove-container
remove-container:
	docker rm ${CONTAINER_NAME}

# remove the image
.PHONY: remove-image
remove-image:
	docker rmi ${IMAGE_NAME}

# clean everything up
.PHONY: clean
clean: stop remove-container remove-image

# show running containers
.PHONY: ps
ps:
	docker ps -a

# show logs
.PHONY: logs
logs:
	docker logs ${CONTAINER_NAME}
