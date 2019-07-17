FROM registry.cn-qingdao.aliyuncs.com/egp/egp_sails:latest

WORKDIR /app
COPY manage_server /app
RUN npm cache clean -f && npm install > /dev/null 2>&1
CMD ["sails", "lift"]
