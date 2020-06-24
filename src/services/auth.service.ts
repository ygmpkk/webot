import config from "rob-config";
import { UserStatus, User, IUser } from "../models/user.model";
import { Token, AuthType, IToken } from "../models/token.model";
import { BaseService } from "./base.service";
import { sign, verify } from "./token.service";
import { AuthError, OperationError } from "../error";
import { FastifyRequest } from "fastify";
import { IncomingMessage } from "http";

export class AuthService extends BaseService {
  getToken = (req: FastifyRequest<IncomingMessage>) => {
    const token =
      req.headers.authorization ||
      req.query["token"] ||
      req.query["accessToken"] ||
      req.query["access_token"] ||
      req.query["access-token"] ||
      "";
    return token.replace(/bearer/i, "").trim();
  };

  async authenticate() {
    const req = this.context.req;
    const token = this.getToken(req);
    if (!token) {
      throw new AuthError({
        statusCode: 401,
        message: "Authorization缺失",
      });
    }

    try {
      const tokenInfo = verify(token);
      const auth = await Token.findByPk(tokenInfo.authId);
      if (!auth) {
        throw new AuthError({
          statusCode: 401,
          message: "登录认证信息失败",
        });
      }

      if (auth.userId) {
        const user = await User.findByPk(auth.userId);

        if (!user) {
          throw new AuthError({
            statusCode: 401,
            message: "登录认证信息失败",
          });
        }

        req["user"] = user.toJSON();
        this.context.user = req["user"];
      }
    } catch (error) {
      throw new AuthError({
        statusCode: 401,
        message: error.message || "无效Token",
      });
    }
  }

  async signin({ identity }) {
    const token = await Token.findOne({ where: { identity } });
    if (token) {
      return sign({ authId: token.id, userId: token.userId }, 86400 * 365 * 10);
    }
  }
}
