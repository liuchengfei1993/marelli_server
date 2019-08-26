docker stop marelli_manage

docker rm marelli_manage

docker rmi registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_manage:latest

docker pull registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_manage:latest

docker run -d -p 1337:1337 -v /home/uploads:/app/uploads --name marelli_manage registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_manage:latest