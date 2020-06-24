module.exports = {
  server: {
    host: "0.0.0.0",
    port: 5000,
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
  serverOptions: {
    swagger: {
      enable: true,
      servers: ["http://localhost:4000"],
    },
  },
  security: {
    rsa: {
      privateKey: "",
      publicKey: "",
    },
    jwt: {
      secret: "B2001EFD6808477DA6074846BC843D29",
      algorithm: "HS256",
      expiresIn: "1d",
    },
  },
  cors: {
    origin: "*",
    allowedHeaders: "*",
  },
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
  db: {
    host: "127.0.0.1",
    port: 5432,
    database: "webot",
    user: "postgres",
    password: "postgres",
    dialect: "postgres",
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  sms: {
    required: false,
    config: {
      apikey: "05d1357dd621f098be16a5c3431c1e02",
    },
  },
  audit: {
    auditUser: "12341234123",
  },
  apple: {
    clientId: "",
    clientSecret: "",

    iap: {
      // verifyReceiptURL: "https://buy.itunes.apple.com/verifyReceipt",
      verifyReceiptURL: "https://sandbox.itunes.apple.com/verifyReceipt",
    },
  },
};
