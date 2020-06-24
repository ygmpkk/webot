import { IUser } from "../models/user.model";
import { Context } from "../context";
import { bot } from "../services/webot.service";

module.exports = {
  Mutation: {
    say: async (_, params, context: Context<IUser>) => {
      const room = await bot.Room.find({ topic: params.topic });
      await room?.say(params.message);
    },
  },
};
