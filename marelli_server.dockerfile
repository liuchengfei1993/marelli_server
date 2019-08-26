#FROM 设置镜像
FROM registry.cn-hangzhou.aliyuncs.com/personal_git/sails_base:latest
# 设置镜像作者
MAINTAINER liuchengfei 
# 创建目录
RUN mkdir -p  /app
# 安装npm模块
# ADD package.json /app/csp/package.json
# 安装npm模块
WORKDIR /app
# 使用淘宝的npm镜像
# RUN npm install --production -d --registry=http://registry.npm.taobao.org
# 再装pm2
# RUN npm install -g pm2 --registry=https://registry.npm.taobao.org
# 安装sails
# RUN npm install sails -g
# 添加源代码
COPY marelli_server /app
# COPY marelli_manage /app
# 设置环境变量
ENV NODE_ENV production
# 用环境变量启动
CMD /bin/sh ./docker_start.sh $NODE_ENV
RUN npm cache clean -f && npm install > /dev/null 2>&1
CMD ["sails", "lift"]
