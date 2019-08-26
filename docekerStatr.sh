#! /bin/bash  # employ bash shell
# player1=刘成飞 # define a player1
# player2=ken  
# echo "Game start! $player1  $player2" # echo is used to printf in terminal
docker stop marelli_server

docker rm marelli_server

docker rmi registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_server:latest

docker pull registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_server:latest

docker run -d -p 1339:1339 --name marelli_server registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_server:latest

docker stop marelli_manage

docker rm marelli_manage

docker rmi registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_manage:latest

docker pull registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_manage:latest

docker run -d -p 1337:1337 -v /home/uploads:/app/uploads --name marelli_manage registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_manage:latest




