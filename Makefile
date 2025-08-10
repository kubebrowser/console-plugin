IMG = ghcr.io/kubebrowser/console-plugin:latest
PLATFORMS=linux/amd64

docker-build:
	docker build --platform=${PLATFORMS} -t ${IMG} . 

docker-push:
	docker push ${IMG} 