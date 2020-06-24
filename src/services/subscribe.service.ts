import { PubSub } from "graphql-subscriptions";

export enum SubscribeTrigger {
  ON_SCAN = "on_scan",
  ON_LOGIN = "on_login",
  ON_MESSAGE = "on_message",
}

export const pubsub = new PubSub();
