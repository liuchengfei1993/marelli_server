FROM node:10.14-alpine

RUN apk update --repository http://mirrors.aliyun.com/alpine/v3.6/main && \
    apk add tzdata --repository http://mirrors.aliyun.com/alpine/v3.6/main && \
    apk add git --repository http://mirrors.aliyun.com/alpine/v3.6/main && \
    apk add python --repository http://mirrors.aliyun.com/alpine/v3.6/main && \
    apk add gcc --repository http://mirrors.aliyun.com/alpine/v3.6/main && \
    apk add g++ --repository http://mirrors.aliyun.com/alpine/v3.6/main && \
    apk add make --repository http://mirrors.aliyun.com/alpine/v3.6/main && \
    rm -rf /var/cache/apk && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    npm install -s -g sails --registry=https://registry.npm.taobao.org 
