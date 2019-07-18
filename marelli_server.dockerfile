FROM registry.cn-hangzhou.aliyuncs.com/personal_git/base_image:1.0.0

# 设置镜像作者
MAINTAINER liuchengfei 
# 创建目录
RUN mkdir -p  /app
WORKDIR /app
COPY marelli_server /app
# 设置环境变量
# ENV NODE_ENV development
# 用环境变量启动
# CMD /bin/sh ./docker_start.sh $NODE_ENV
RUN npm install 
CMD ["sails", "lift"]