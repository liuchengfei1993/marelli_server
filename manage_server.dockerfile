FROM registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_server

WORKDIR /app
COPY manage_server /app
RUN npm cache clean -f && npm install > /dev/null 2>&1
CMD ["sails", "lift"]
