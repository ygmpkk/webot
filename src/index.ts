import path from "path";
import config from "rob-config";
import { Server, IncomingMessage, ServerResponse } from "http";
import { FastifyReply } from "fastify";

import factory, { createServer } from "./factory";
import { IServer } from "./interface";
import { adminSchema, webhookSchema } from "./resolvers";
import { sequelize } from "./db";
import { errorSchema } from "./error";
import graphqlService from "./endpoints/graphql";
import setupService from "./endpoints/setup";

const pkg = require("../package.json");

const app: IServer<Server, IncomingMessage, ServerResponse> = factory({
  pkg,
  config: config,
});

// 页面渲染View
app.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
  root: path.join(__dirname, "templates"),
  options: {
    useHtmlMinifyStream: require("html-minify-stream"),
    htmlMinifierOptions: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: false,
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: false,
      useShortDoctype: true,
      minifyJS: {
        mangle: true,
        output: {
          beautify: false,
          comments: false,
        },
      },
      minifyCSS: true,
    },
    production: true,
  },
  defaultContext: {
    dev: process.env.NODE_ENV === "development",
  },
});

// 数据库
app.decorate("db", sequelize);
app.ready(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("Succesfuly connected to db.");
  } catch (error) {
    console.error(error);
  }
});

// Cookie
app.register(require("fastify-cookie"), {
  secret: config.get("security.secret"),
  parseOptions: {},
});

app.setErrorHandler((error, req: any, reply: FastifyReply<ServerResponse>) => {
  req.log.error({
    stack: error.stack,
    name: error.name,
    messsage: error.message,
    statusCode: error.statusCode,
  });
  if (error.statusCode) {
    reply.code(error.statusCode || 200);
  }
  reply.send(error);
});
app.addSchema(errorSchema);

// 用户上下文
app.decorateRequest("user", {});

app.addHook("preHandler", (req, reply, next) => {
  reply.header("x-request-id", req.id);
  next();
});

app.register(setupService);

// admin graphql
const adminConfig = config.get("graphql.admin");
app.register(graphqlService, {
  options: { ...adminConfig, schema: adminSchema },
  preHandler: async () => {},
});

// webhook graphql
const webhookConfig = config.get("graphql.webhook");
app.register(graphqlService, {
  options: { ...webhookConfig, schema: webhookSchema },
  preHandler: async () => {},
});

createServer(app, {
  port: config.get("server.port"),
  host: config.get("server.host"),
});
