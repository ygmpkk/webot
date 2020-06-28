import { ScanStatus } from "wechaty";
import { Context } from "../context";
import { AuthService } from "../services/auth.service";
import { IUser } from "../models/user.model";
import { pubsub, SubscribeTrigger } from "../services/subscribe.service";
import { wechatQrcode, bot } from "../services/webot.service";

module.exports = {
  ScanStatus: {
    Unknown: ScanStatus.Unknown,
    Cancel: ScanStatus.Cancel,
    Waiting: ScanStatus.Waiting,
    Scanned: ScanStatus.Scanned,
    Confirmed: ScanStatus.Confirmed,
    Timeout: ScanStatus.Timeout,
    Logged: "Logged",
  },

  Mutation: {
    admin: (_, __, context: Context<IUser>) => {
      const authService = new AuthService(context);

      return {
        start: async () => {
          if (wechatQrcode) {
            pubsub.publish(SubscribeTrigger.ON_SCAN, {
              status: ScanStatus.Waiting,
              url: wechatQrcode,
            });
          } else {
            pubsub.publish(SubscribeTrigger.ON_SCAN, {
              status: "Logged",
              url: (await bot.self().avatar())["remoteUrl"],
            });
          }

          return true;
        },

        signin: async (params) => {
          const token = await authService.signin(params);

          const reply: any = context.reply;
          reply.setCookie("token", token, {
            path: "/",
            expires: new Date("2025-01-01"),
          });

          return token;
        },

        token: (params) => authService.token(params),
      };
    },
  },

  Subscription: {
    onScan: {
      resolve: async (payload, params, context: Context<IUser>) => {
        return payload;
      },
      subscribe: () => pubsub.asyncIterator(SubscribeTrigger.ON_SCAN),
    },

    // onMessage: {
    //   subscribe: () => pubsub.asyncIterator(SubscribeTrigger.ON_MESSAGE),
    // },
  },
};
