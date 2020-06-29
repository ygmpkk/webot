import crypto from "crypto";
import { User } from "../models/user.model";
import { Token, AuthType } from "../models/token.model";
import { BaseService } from "./base.service";
import { sign, verify } from "./token.service";
import { AuthError } from "../error";
import { FastifyRequest } from "fastify";
import { IncomingMessage } from "http";
import cookies from "cookie";

export class AuthService extends BaseService {
  static getToken = (req: FastifyRequest<IncomingMessage>) => {
    var cookie = cookies.parse(req.headers.cookie || "").token;
    const token = req.headers.authorization || "";
    return (
      token.replace(/^bearer/i, "").trim() ||
      (req.query && req.query["token"]) ||
      cookie ||
      ""
    );
  };

  async authenticate() {
    const req = this.context.req;
    const token = AuthService.getToken(req);
    if (!token) {
      throw new AuthError({
        statusCode: 401,
        message: "未认证",
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

  async signin({ identity, password }) {
    const count = await Token.count();

    let token;
    if (count === 0) {
      const user = await User.create({});
      token = await Token.create({
        identity,
        type: AuthType.LOCAL,
        userId: user.id,
        raw: { password },
      });
      // 创建一个webhook token
      await Token.create({
        identity: crypto.randomBytes(16).toString("hex"),
        type: AuthType.TOKEN,
        userId: user.id,
      });
    } else {
      token = await Token.findOne({
        where: { identity, raw: { password } },
      });
    }

    if (!token) {
      throw new AuthError({
        statusCode: 401,
        message: "登录失败",
      });
    }

    return sign({ authId: token.id, userId: token.userId }, 0);
  }

  async token({}) {
    const token = await Token.findOne({
      where: { type: AuthType.TOKEN },
    });
    return sign({ authId: token?.id, userId: token?.userId }, 0);
  }
}
