import config from "rob-config";
import { Wechaty, ScanStatus, Message, MemoryCard } from "wechaty";
import { pubsub, SubscribeTrigger } from "./subscribe.service";
import PuppetPadPro from "wechaty-puppet-padplus";
import QRCode from "qrcode";
import { logger } from "../logger";

const { name, token } = config.get("webot");

const puppet = new PuppetPadPro({
  token: token,
});

export const bot = new Wechaty({
  name: name,
  puppet: puppet,
});

const cached = {};
export const getQrcode = () => cached["qrcode"];

this.bot
  .on("start", () => {
    logger.info("onStart");
  })
  .on("scan", async (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting) {
      cached["qrcode"] = await QRCode.toDataURL(qrcode);
      logger.info("扫码登录:", cached["qrcode"], status);

      pubsub.publish(SubscribeTrigger.ON_SCAN, {
        status,
        url: cached["qrcode"],
      });
    }
  })
  .on("login", async (user) => {
    logger.info("登录成功：" + user);

    pubsub.publish(SubscribeTrigger.ON_SCAN, {
      status: "Logged",
      url: await (await bot.userSelf().avatar()).toDataURL(),
    });
  })
  .on("message", async (message: Message) => {
    logger.info("收到消息：" + message);
    // TODO 定义一套 keyworkd 和 outgoing request api
    // if (message.self()) {
    //   return;
    // }

    // const text = message.text();
    // const room = message.room();
    // const fromUser: any = message.from();

    // if (room) {
    //   if (await message.mentionSelf()) {
    //
    //     if (/净值/.test(text)) {
    //       room.say(`最新净值: 1.37`, fromUser);
    //     }
    //   }
    // }
  })
  .on("friendship", (friendship) => console.log("收到好友请求：", friendship))
  .on("room-join", (room, inviteeList, inviter) => {
    logger.info(
      `Room got new member ${inviteeList.map(
        (item) => item.name
      )}, invited by ${inviter}`
    );
  })
  .on("room-invite", (invitation) => logger.info("收到入群邀请：", invitation))
  .start()
  .then(() => logger.info("StarterBot", "Starter Bot Started."))
  .catch((e) => logger.error("StarterBot", e));
