import config from "rob-config";
import { Server, IncomingMessage, ServerResponse } from "http";
import factory, { createServer } from "./factory";
import { IServer } from "./interface";
import { schema } from "./resolvers";

import graphqlService from "./endpoints/graphql";
// import setupService from "./endpoints/setup";
import { sequelize } from "./db";

const pkg = require("../package.json");

const app: IServer<Server, IncomingMessage, ServerResponse> = factory({
  pkg,
  config: config,
});

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

// app.setErrorHandler((error, req: any, reply: any) => {
//   req.log.error({
//     stack: error.stack,
//     name: error.name,
//     messsage: error.message,
//     statusCode: error.statusCode,
//   });
//   reply.send(error);
// });

// 用户上下文
app.decorateRequest("user", {});

app.addHook("preHandler", (req, reply, next) => {
  reply.header("x-request-id", req.id);
  next();
});

app.register(graphqlService, {
  prefix: "/gql",
  subscriptionPath: "/pubsub",
  options: { ...config.get("graphql"), schema },
  preHandler: async () => {},
});

createServer(app, {
  port: config.get("server.port"),
  host: config.get("server.host"),
});
