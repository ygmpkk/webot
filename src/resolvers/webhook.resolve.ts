import { IUser } from "../models/user.model";
import { Context } from "../context";
import { bot } from "../services/webot.service";

module.exports = {
  Mutation: {
    say: async (_, { topic, message, mention }, context: Context<IUser>) => {
      const room = await bot.Room.find({ topic: topic });
      if (!room) {
        throw new Error(`没有找到群: ${topic}`);
      }

      if (mention) {
        const members = await room.memberAll();
        const member = members.find((item) => {
          return item.name().includes(mention);
        });
        room.say(message, member);
      } else {
        room.say(message);
      }

      return true;
    },
  },
};
