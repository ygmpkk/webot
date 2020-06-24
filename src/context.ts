import { IncomingMessage, ServerResponse } from 'http';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Sequelize } from 'sequelize';

export interface Context<T> {
  req: FastifyRequest<IncomingMessage>;
  reply: FastifyReply<ServerResponse>;
  db: Sequelize;
  user: T;
  app: any;
}
