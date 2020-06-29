# 微信机器人

## 安装

Host

```shell
yarn install --production
NODE_ENV=production WEBOT_NAME=机器人 WEBOT_TOKEN=xxx node dist/index.js
```

Docker

构建Docker

```
docker build . --tag webot:latest
```

运行Docker

```shell
docker run -d --name bot \
--env NODE_ENV=production \
--env SERVER_HOST=0.0.0.0 \
--env WEBOT_NAME=机器人 \
--env WEBOT_TOKEN=微信协议TOKEN \
--env DB_STORAGE=/data/bot.sqlite3 \
-v $(pwd):/data \
-p 5500:5500 \
webot:latest
```

## 使用

| 配置     | URL                           |
| -------- | ----------------------------- |
| 登录地址 | http://127.0.0.1:5500/signin  |
| 配置地址 | http://127.0.0.1:5500/setup   |
| WebHook  | http://127.0.0.1:5500/webhook |

> 需要使用微信扫码登录，登录可以获取一串Token，WebHook需要用到







### WebHook

| 字段         | 值                            |
| ------------ | ----------------------------- |
| Endpoint     | http://127.0.0.1:5500/webhook |
| Method       | POST                          |
| Content-Type | application/json              |
| 数据交换格式 | GraphQL                       |

> Token支持放在URL、Header以及Cookie，任意放一个地方就可以了

| 位置   | 字段          |
| ------ | ------------- |
| URL    | token         |
| Header | Authorization |
| Cookie | token         |

示例:

URL

```http
> POST /webhook?token=YOUR TOKEN HTTP/1.1
> Host: 127.0.0.1:5500
> Content-Type: application/json
```

Header

```http
> POST /webhook HTTP/1.1
> Host: 127.0.0.1:5500
> Content-Type: application/json
> Authorization: Bearer YOUR TOKEN
```

Cookie
```http
> POST /webhook HTTP/1.1
> Host: 127.0.0.1:5500
> Cookie: token=YOUR TOKEN
> Content-Type: application/json
```

> Webhook的GraphQL默认开启自省模式，推荐使用Postman或者Insomnia工具调试GraphQL请求。如果不想使用Postman或者Insomnia工具调试，直接使用HTTP请求，按照示例的数据结构，把variables的值替换掉就和普通的Restful请求一样



 HTTP请求规范

| 字段      | 类型   | 备注                      |
| --------- | ------ | ------------------------- |
| query     | String | GraphQL语句               |
| variables | Object | GraphQL定义的变量【可选】 |



## 机器人消息

### 发送消息到群里

#### GraphQL

```graphql
mutation ($topic: String!, $message: String!, $mention: [String]) {
  room {
    say(topic: $topic, message: $message, mention: $mention)
  }
}
```

> $mention: [String]是可选参数，如果不想@某人的话，可以不用定义

#### 请求示例

发送一条普通的群消息

```json
{
  "query": "mutation ($topic: String!, $message: String!) { room { say(topic: $topic, message: $message) } }",
  "variables": {
    "topic": "群组",
    "message": "消息"
  }
}
```

发送一条@某用户的消息

```json
{
  "query": "mutation ($topic: String!, $message: String!, $mention: [String]) { room { say(topic: $topic, message: $message, mention: $mention) } }",
  "variables": {
    "topic": "群组",
    "message": "消息",
    "mention": ["微信ID"]
  }
}
```

CURL请求示例

```shell
curl --request POST \
  --url 'http://127.0.0.1:5500/webhook?token=YOUR TOKEN' \
  --header 'content-type: application/json' \
  --data '{"query":"mutation ($topic: String!, $message: String!, $mention: [String]) { room { say(topic: $topic, message: $message, mention: $mention) } }","variables":{"topic":"群组","message":"内容","mention":["微信ID"]}}'
```


