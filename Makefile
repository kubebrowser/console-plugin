IMG = ghcr.io/kubebrowser/console-plugin:0.0.1
PLATFORMS=linux/amd64,linux/arm64

docker-build:
	docker build --platform=${PLATFORMS} -t ${IMG} . 

docker-push:
	docker push ${IMG} 