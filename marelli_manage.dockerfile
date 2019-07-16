FROM registry.cn-hangzhou.aliyuncs.com/personal_git/marelli_server:latest

WORKDIR /app
COPY marelli_server /app
COPY marelli_manage /app
RUN /app/link_transfer.sh && rm -rf /egp_server && npm install > /dev/null 2>&1
CMD ["sails", "lift"]
