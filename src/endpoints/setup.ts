import config from "rob-config";
import { IncomingMessage, ServerResponse, Server } from "http";
import { FastifyRequest } from "fastify";

import { IServer } from "../interface";
import Token from "../models/token.model";

const { path, subscriptionPath } = config.get("graphql.admin");

export default function (
  router: IServer<Server, IncomingMessage, ServerResponse>,
  opts: any,
  next: (err?: Error) => void
) {
  router.get("/setup", (req: FastifyRequest<IncomingMessage>, reply: any) => {
    reply.view("/setup.html", {
      url:
        config.get("graphql.client.url") ||
        `ws://${req.hostname}${subscriptionPath}`,
      path,
    });
  });

  router.get(
    "/signin",
    async (req: FastifyRequest<IncomingMessage>, reply: any) => {
      const count = await Token.count();

      reply.view("/signin.html", {
        buttonText: count === 0 ? "SIGN UP" : "SIGN IN",
        hostname: req.hostname,
        path,
      });

      return reply;
    }
  );

  next();
}
