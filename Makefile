IMG = quay.io/mohamedf0/kubebrowser-console-plugin
PLATFORMS=linux/amd64

docker-build:
	docker build --platform=${PLATFORMS} -t ${IMG} . 

docker-push:
	docker push ${IMG} 