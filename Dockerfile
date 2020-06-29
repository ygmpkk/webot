FROM node:12-alpine
LABEL version="1.0"
LABEL description="微信机器人"
LABEL author="Timothy(ygmpkk@gmail.com)"

VOLUME /data
WORKDIR /srv
RUN mkdir -p /srv/config
RUN mkdir -p /srv/dist

# 替换为中国源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN npm config set registry https://registry.npm.taobao.org
RUN npm i -g pm2
RUN apk add python linux-headers build-base

COPY package.json ./
COPY dist ./dist/
COPY config/schema.js ./config/
COPY config/production.js ./config/

RUN yarn install --production

EXPOSE 5500
CMD ["pm2-runtime", "dist/index.js"]