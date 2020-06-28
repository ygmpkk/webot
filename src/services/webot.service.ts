import { Wechaty, ScanStatus, Message } from "wechaty";
import { pubsub, SubscribeTrigger } from "./subscribe.service";
import PuppetPadPro from "wechaty-puppet-padplus";

const WECHATY_PUPPET_PADPRO_TOKEN = "puppet_padplus_e10fadfcc7cbd3a0";
const puppet = new PuppetPadPro({
  token: WECHATY_PUPPET_PADPRO_TOKEN,
});

export const bot = new Wechaty({
  name: "得令机器人",
  puppet: puppet,
});

export let wechatQrcode = "";

this.bot
  .on("start", () => {
    console.log("onStart");
  })
  .on("scan", (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting) {
      wechatQrcode = [
        "https://api.qrserver.com/v1/create-qr-code/?data=",
        encodeURIComponent(qrcode),
      ].join("");
      console.log("扫码登录:", wechatQrcode);
      pubsub.publish(SubscribeTrigger.ON_SCAN, {
        status,
        url: wechatQrcode,
      });
      return;
    }

    console.log("扫码登录：" + qrcode);
  })
  .on("login", async (user) => {
    console.log("登录成功：" + user);
  })
  .on("message", async (message: Message) => {
    console.log("收到消息：" + message);
    if (message.self()) {
      return;
    }

    const text = message.text();
    const room = message.room();
    const fromUser: any = message.from();

    console.log("text: ", text);
    console.log("room:", room);

    if (room) {
      if (await message.mentionSelf()) {
        // TODO 定义一套 outgoing
        if (/净值/.test(text)) {
          room.say(`最新净值: 1.37`, fromUser);
        }
      }
    }
  })
  .on("friendship", (friendship) => console.log("收到好友请求：" + friendship))
  .on("room-join", (room, inviteeList, inviter) => {
    console.log(
      `Room got new member ${inviteeList.map(
        (item) => item.name
      )}, invited by ${inviter}`
    );
  })
  .on("room-invite", (invitation) => console.log("收到入群邀请：" + invitation))
  .start()
  .then(() => console.info("StarterBot", "Starter Bot Started."))
  .catch((e) => console.error("StarterBot", e));
