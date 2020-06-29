import { IUser } from "../models/user.model";
import { Context } from "../context";
import { bot } from "../services/webot.service";

module.exports = {
  Mutation: {
    room: (_, __, context: Context<IUser>) => {
      return {
        say: async ({ topic, message, mention }) => {
          // 应该避免群名重复
          const room = await bot.Room.find({ topic: topic });
          if (!room) {
            throw new Error(`没有找到群: ${topic}`);
          }

          if (mention) {
            const members = await room.memberAll();
            const member = members.find((item) => {
              return item.id.includes(mention);
            });

            // 应该避免@一个不存在的用户
            if (!member) {
              throw new Error(`在“${topic}”没有找到“${mention}”`);
            }

            room.say(message, member);
          } else {
            room.say(message);
          }

          return true;
        },
      };
    },
  },
};
