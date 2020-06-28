import { RouteSchema, RouteShorthandOptions } from "fastify";

export interface IExtensions {
  code: string;
}

export interface IGraphQLError {
  name: string;
  message: string;
  headers: string;
  extensions: IExtensions;
  statusCode: number;
}

export interface IRouteSchema extends RouteSchema {
  tags: Array<string>;
}

export interface IRouteOptions extends RouteShorthandOptions {
  schema: IRouteSchema;
}

export const errorSchema: object = {
  $id: "error",
  type: "object",
  required: ["message", "errors"],
  description: "错误异常",
  properties: {
    ok: { type: "boolean", description: "执行成功或者失败" },
    errCode: { type: "string", description: "错误码" },
    statusCode: { type: "int", description: "HTTP状态码" },
    message: {
      type: "string",
      description: "概要的错误内容",
    },
    errors: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            field: {
              type: "string",
              description: "字段错误",
            },
            error: {
              type: "string",
              description: "错误内容",
            },
            type: {
              type: "string",
              description: "错误类型",
            },
          },
        },
      ],
      example: [
        {
          field: "string",
          error: "string",
          type: "string",
        },
      ],
    },
  },
};

export interface IError {
  message: string;
  statusCode?: number;
  errorCode?: string;
  extensions?: Object;
}

export class OperationError extends Error {
  description: string;
  statusCode?: number;
  errorCode?: string;
  extensions?: Object;

  constructor({ message, statusCode, errorCode, extensions }: IError) {
    super(message);
    this.name = "OperationError";
    this.description = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.extensions = extensions;
  }
}

export class AuthError extends Error {
  description: string;
  statusCode?: number;
  errorCode?: string;
  extensions?: Object;

  constructor({ message, statusCode, errorCode, extensions }: IError) {
    super(message);
    this.name = "AuthError";
    this.description = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.extensions = extensions;
  }
}
