import { IncomingMessage, ServerResponse, Server } from "http";
import { FastifyRequest } from "fastify";

import { IServer } from "../interface";
import Token from "../models/token.model";

export default function (
  router: IServer<Server, IncomingMessage, ServerResponse>,
  opts: any,
  next: (err?: Error) => void
) {
  router.get("/setup", (req: FastifyRequest<IncomingMessage>, reply: any) => {
    reply.view("/index.html", { hostname: req.hostname });
  });

  router.get(
    "/signin",
    async (req: FastifyRequest<IncomingMessage>, reply: any) => {
      const count = await Token.count();
      
      reply.view("/signin.html", {
        buttonText: count === 0 ? "Sign Up" : "Sign In",
        hostname: req.hostname,
      });

      return reply;
    }
  );

  next();
}

export const withSubscription = () => {};
