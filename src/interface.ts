import { FastifyInstance, FastifyRequest, FastifyReply, RouteShorthandOptions, RequestHandler } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { Sequelize } from 'sequelize';

export interface IRobConfig {
  has(key: string): boolean;
  get(key: string): any;
  set(key: string, value: string): any;
}

export interface IDb extends Sequelize {}

export interface IPkg {
  name: string;
  version: string;
}

export interface IServerOptions {
  pkg: IPkg;
  config: IRobConfig;
}

export interface IServer<Server, IncomingMessage, ServerResponse, DefaultConfig = IRobConfig, DefaultDb = Sequelize>
  extends FastifyInstance<Server, IncomingMessage, ServerResponse> {
  config?: DefaultConfig;
  sequelize?: DefaultDb;
  publicIp?: string;
}

export interface IBaseUser {}

export interface IReq<IncomingMessage, DefaultUser = IBaseUser, DefaultCookies = any>
  extends FastifyRequest<IncomingMessage> {
  user: DefaultUser;
  cookies: DefaultCookies;
}

export interface IReply<IncomingMessage, DefaultSetCookies = any> extends FastifyReply<IncomingMessage> {
  setCookie: DefaultSetCookies;
}

export interface IApp {
  appname: string;
  appversion: string;
  channel: string;
  buildNumber: string;
  platform: string;
  userAgent: string;
  // sign
  signature: string;
  nonce: string;
  timestamp: number;
}

export interface IResolver<IUser> {
  req: IReq<IncomingMessage, IUser, any>;
  reply: IReply<ServerResponse, any>;
  server: IServer<Server, IncomingMessage, ServerResponse>;
  sequelize: Sequelize;
  app: IApp;
}

export interface ISetCookieOptions {
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
}
