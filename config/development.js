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
    introspection: true,
    debug: true,
    tracing: true,
  },
  logger: {
    level: "debug",
    prettyPrint: true,
  },
  cors: {
    origin: "*",
    allowedHeaders: "*",
  },
  db: {
    dialect: "sqlite3",
    storage: path.join(__dirname, "../bot.sqlite3"),
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};
