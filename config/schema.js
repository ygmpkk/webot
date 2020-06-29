const path = require("path");

module.exports = {
  env: {
    doc: "应用运行环境",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  server: {
    host: {
      doc: "Web服务Host",
      format: "String",
      default: "127.0.0.1",
      env: "SERVER_HOST",
    },
    port: {
      doc: "Web服务端口",
      format: "port",
      env: "SERVER_PORT",
      default: 5500,
    },
    timeout: {
      doc: "API请求超时时间",
      format: "nat",
      default: 2 * 60 * 1000,
      env: "SERVER_TIMEOUT",
    },
  },
  logger: {
    level: {
      doc: "日志级别",
      format: ["info", "error", "debug", "fatal", "warn", "trace", "child"],
      default: "warn",
      env: "LOGGER_LEVEL",
    },
    prettyPrint: {
      doc: "友好的日志格式",
      format: "Boolean",
      default: false,
      env: "LOGGER_PRETTY",
    },
  },
  serverOptions: {
    ignoreTrailingSlash: {
      doc: "是否忽略URL尾部/",
      format: "Boolean",
      default: true,
    },
    bodyLimit: {
      doc: "Body请求大小限制",
      default: 1024 * 1024 * 20,
      format: "Number",
      env: "BODY_LIMIT",
    },
    disableRequestLogging: {
      doc: "关闭请求日志",
      format: "Boolean",
      default: false,
      env: "DISABLE_REQUEST_LOGGING",
    },
    caseSensitive: {
      doc: "忽略URL大小写",
      format: "Boolean",
      default: false,
    },
    requestIdHeader: {
      doc: "请求ID字段",
      format: "String",
      default: "request-id",
    },
  },
  security: {
    secret: {
      doc: "安全密钥",
      format: "String",
      default: "4508cfc28c1773fcfb9cca8d75fc531a", // 32位长度
      env: "SECURITY_SECRET",
    },
  },
  cors: {
    origin: {
      doc: "Configures the Access-Control-Allow-Origin CORS header.",
      format: "String",
      default: "*",
    },
    methods: {
      doc: "Configures the Access-Control-Allow-Methods CORS header.",
      format: "String",
      default: "GET,HEAD,PUT,PATCH,POST,DELETE",
    },
    allowedHeaders: {
      doc: "Configures the Access-Control-Allow-Headers CORS header.",
      format: "String",
      default: "*",
    },
    exposedHeaders: {
      doc: "Configures the Access-Control-Expose-Headers CORS header.",
      format: "String",
      default: "",
    },
    credentials: {
      doc: "Configures the Access-Control-Allow-Credentials CORS header.",
      format: "Boolean",
      default: false,
    },
    maxAge: {
      doc: "Configures the Access-Control-Max-Age CORS header.",
      format: "Number",
      default: 3600,
    },
    preflightContinue: {
      doc: "Pass the CORS preflight response to the next handler.",
      format: "Boolean",
      default: false,
    },
    optionsSuccessStatus: {
      doc:
        "Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204.",
      format: "Number",
      default: 204,
    },
  },
  graphql: {
    client: {
      url: {
        doc: "GraphQL客户端路径",
        format: "String",
        default: "", // ws://localhost:5500/pubsub
        env: "ADMIN_GRAPHQL_PATH",
      },
    },
    admin: {
      path: {
        doc: "GraphQL路径",
        format: "String",
        default: "/gql",
        env: "ADMIN_GRAPHQL_PATH",
      },
      subscription: {
        doc: "是否启用GraphQL Subscription",
        format: "Boolean",
        default: true,
        env: "ADMIN_GRAPHQL_SUBSCRIPTION",
      },
      subscriptionPath: {
        doc: "GraphQL Subscription路径",
        format: "String",
        default: "/pubsub",
        env: "ADMIN_GRAPHQL_SUBSCRIPTION_PATH",
      },
      introspection: {
        doc: "是否开启GraphQL自省",
        format: "Boolean",
        default: false,
        env: "ADMIN_GRAPHQL_INTROSPECTION",
      },
      debug: {
        doc: "是否开启GraphQL调试模式",
        format: "Boolean",
        default: false,
        env: "ADMIN_GRAPHQL_DEBUG",
      },
      tracing: {
        doc: "是否开启GraphQL跟踪模式",
        format: "Boolean",
        default: false,
        env: "ADMIN_GRAPHQL_TRACING",
      },
    },
    webhook: {
      path: {
        doc: "GraphQL路径",
        format: "String",
        default: "/webhook",
        env: "WEBHOOK_GRAPHQL_PATH",
      },
      introspection: {
        doc: "是否开启GraphQL自省",
        format: "Boolean",
        default: true,
        env: "WEBHOOK_GRAPHQL_INTROSPECTION",
      },
      debug: {
        doc: "是否开启GraphQL调试模式",
        format: "Boolean",
        default: false,
        env: "WEBHOOK_GRAPHQL_DEBUG",
      },
      tracing: {
        doc: "是否开启GraphQL跟踪模式",
        format: "Boolean",
        default: false,
        env: "WEBHOOK_GRAPHQL_TRACING",
      },
    },
  },
  db: {
    storage: {
      doc: "Sqlite3数据库地址",
      format: "String",
      default: path.join(__dirname, "../bot.sqlite3"),
      env: "DB_STORAGE",
    },
    dialect: {
      doc: "数据库连接适配器",
      format: ["sqlite", "mysql", "mariadb", "postgres", "mssql"],
      default: "sqlite",
      env: "DB_DIALECT",
    },
    host: {
      doc: "数据库主机地址",
      format: "String",
      env: "DB_HOST",
      default: "",
    },
    port: {
      doc: "数据库端口",
      format: "port",
      env: "DB_PORT",
      default: "",
    },
    database: {
      doc: "数据库名称",
      format: "String",
      env: "DB_DATABASE",
      default: "",
    },
    user: {
      doc: "数据库用户名",
      format: "String",
      env: "DB_USER",
      default: "",
    },
    password: {
      doc: "数据库用户密码",
      format: "String",
      env: "DB_PASSWORD",
      default: "",
    },
    autoConnect: {
      doc: "是否自动重联",
      format: "Boolean",
      env: "DB_AUTOCONNECT",
      default: true,
    },
    logging: {
      doc: "SQL日志",
      format: "Boolean",
      env: "DB_LOGGING",
      default: false,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  webot: {
    name: {
      doc: "微信机器人名称",
      format: "String",
      env: "WEBOT_NAME",
      default: "",
    },
    token: {
      doc: "微信机器人Token",
      format: "String",
      env: "WEBOT_TOKEN",
      default: "",
    },
  },
};
