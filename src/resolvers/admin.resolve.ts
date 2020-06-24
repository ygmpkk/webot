import { Context } from "../context";
import { AuthService } from "../services/auth.service";
import { IUser } from "../models/user.model";
import { pubsub, SubscribeTrigger } from "../services/subscribe.service";
import { ScanStatus } from "wechaty";

module.exports = {
  ScanStatus: {
    Unknown: ScanStatus.Unknown,
    Cancel: ScanStatus.Cancel,
    Waiting: ScanStatus.Waiting,
    Scanned: ScanStatus.Scanned,
    Confirmed: ScanStatus.Confirmed,
    Timeout: ScanStatus.Timeout,
  },

  Mutation: {
    signin: (_, params, context: Context<IUser>) =>
      new AuthService(context).signin(params),
  },

  Subscription: {
    onScan: {
      resolve: async (payload, params, context: Context<IUser>) => {
        return payload;
      },
      subscribe: () => pubsub.asyncIterator(SubscribeTrigger.ON_SCAN),
    },

    onMessage: {
      subscribe: () => pubsub.asyncIterator(SubscribeTrigger.ON_MESSAGE),
    },
  },
};
