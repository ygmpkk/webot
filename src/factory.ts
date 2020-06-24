import http from "http";
import { IServerOptions, IServer } from "./interface";
import Fastify, { ServerOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import hyperid from "hyperid";

const fastify: any = Fastify;

const buildFactory = (options: IServerOptions): IServer<Server, IncomingMessage, ServerResponse> => {
  const { config, pkg } = options;

  const serverOptions: ServerOptions = {
    ...config.get("serverOptions"),
    logger: {
      ...config.get("logger"),
      serializers: {
        res(res) {
          return {
            statusCode: res.statusCode,
          };
        },
        req(req) {
          return {
            method: req.method,
            url: req.url,
            path: req.path,
            parameters: req.parameters,
            headers: req.headers,
            requestId: req.reqId,
            hostname: req.hostname,
            remoteAddress: req.headers["x-real-ip"] || req.ip,
            remotePort: req.connection.remotePort,
            packageName: pkg.name,
            packageVersion: pkg.version,
          };
        },
      },
    },
    genReqId: () => hyperid().uuid,
  };

  const coreServer: IServer<Server, IncomingMessage, ServerResponse> = fastify({
    ...serverOptions,
  });

  // cors
  coreServer.use(require("cors")(config.get("cors")));
  coreServer.register(require("fastify-cors"), { options: config.get("cors") });

  // urlencode
  coreServer.register(require("fastify-formbody"));
  // xml
  coreServer.register(require("fastify-xml-body-parser"));

  const server: any = coreServer;
  return server;
};

export const createServer = (server: IServer<Server, IncomingMessage, ServerResponse>, { port, host }: { port: number; host: string }, cb?: Function) => {
  server.listen(port, host, (err: any) => {
    if (err) throw err;
    console.log(server.printRoutes());
    console.log(`Server listen on: http://${host}:${port}`);

    if (cb) {
      cb();
    }
  });
};

export default buildFactory;
