import config from "rob-config";
import { IncomingMessage, ServerResponse, Server } from "http";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  runHttpQuery,
  convertNodeHttpToRequest,
  GraphQLOptions,
} from "apollo-server-core";
import { ConnectionContext } from "subscriptions-transport-ws";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { IServer } from "../interface";
import { AuthService } from "../services/auth.service";

export interface MyGraphQLOptions extends GraphQLOptions {
  introspection?: Boolean;
}

export interface IRouterOptions {
  prefix: string;
  preHandler: any;
  options: MyGraphQLOptions;
}

export default function (
  router: IServer<Server, IncomingMessage, ServerResponse>,
  opts: any,
  next: (err?: Error) => void
) {
  const {
    preHandler,
    options: { schema, path, subscription, subscriptionPath, ...options },
  } = opts;

  router.route({
    method: ["GET", "POST"],
    url: path,
    schema: {
      querystring: {
        query: {
          type: "string",
        },
      },
      body: {
        type: "object",
        properties: {
          query: {
            type: "string",
          },
          operationName: {
            anyOf: [{ type: "string" }, { type: "null" }],
          },
          variables: {
            anyOf: [{ type: "object" }, { type: "null" }],
          },
        },
      },
    },
    preHandler: preHandler,
    handler: (
      req: FastifyRequest<IncomingMessage>,
      reply: FastifyReply<ServerResponse>
    ) => {
      if (req.body && req.body.operationName === "IntrospectionQuery") {
        // 关闭GraphQL提示
        if (!options.introspection) {
          reply.status(403).send("Access deny");
        }
      }

      // Logging graphql request
      // TODO 使用GraphQL的 Extensions 来处理日志问题
      req.log.info({
        graphql: {
          body: req.body.query.replace(/\n/g, "").replace(/\s\s/g, " ").trim(),
          variables: req.body.variables,
        },
      });

      return runHttpQuery([req, reply], {
        method: req.req.method || "POST",
        options: {
          schema,
          context: {
            req,
            reply,
            server: router,
          },
          ...options,
        },
        query: req.req.method === "POST" ? req.body : req.query,
        request: convertNodeHttpToRequest(req.req),
      })
        .then((response) => {
          reply.header("Content-Type", "application/graphql; charset=utf-8");
          reply.send(response.graphqlResponse);
        })
        .catch((err) => {
          if ("HttpQueryError" === err.name) {
            if (err.headers) {
              Object.keys(err.headers).forEach((key) => {
                reply.header(key, err.headers[key]);
              });
            }

            reply.status(err.statusCode).send(JSON.parse(err.message));
          }
        });
    },
  });

  if (subscription) {
    const subscriptionServer = new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        keepAlive: 3000,
        onDisconnect: (websocket: WebSocket, context: ConnectionContext) => {
          // console.log("subscriptions disconnected =>", context.request.headers);
        },
      },
      {
        // node原生的server，脱离了fastify的生命周期，部分请求的内容和结构可能不一致，需要开发者特别注意
        server: router.server,
        path: subscriptionPath,
      }
    );

    subscriptionServer.server.on(
      "connection",
      async (websocket: WebSocket, req: FastifyRequest<IncomingMessage>) => {
        const token = AuthService.getToken(req);
        // console.log("subscriptions connection =>", token, req.headers);

        // 强校验Token
        if (!token) {
          websocket.send(
            JSON.stringify({
              type: "error",
              payload: { code: 401, message: "未认证" },
            })
          );

          return websocket.close(1000, "未认证");
        }
      }
    );

    console.log(
      `🚀 Subscriptions ready at ws://localhost:${config.get(
        "server.port"
      )}${subscriptionPath}`
    );
  }

  next();
}
