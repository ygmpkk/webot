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
