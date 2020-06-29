const path = require("path");

module.exports = {
  server: {
    host: "0.0.0.0",
    port: 5500,
  },
  serverOptions: {
    ignoreTrailingSlash: true,
    bodyLimit: 1024 * 1024 * 20,
    disableRequestLogging: false,
    caseSensitive: false,
    requestIdHeader: "request-id",
  },
  graphql: {
    admin: { introspection: true, debug: true, tracing: true },
    webhook: { introspection: true, debug: true, tracing: true },
  },
  logger: {
    level: "debug",
    prettyPrint: false,
  },
  security: {
    secret: "4508cfc28c1773fcfb9cca8d75fc531a",
  },
  cors: {
    origin: "*",
    allowedHeaders: "*",
  },
  db: {
    dialect: "sqlite",
    storage: path.join(__dirname, "../bot.sqlite3"),
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  webot: {
    name: "得令机器人",
    token: "puppet_padplus_e10fadfcc7cbd3a0",
  },
};
