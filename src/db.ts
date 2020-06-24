import config from "rob-config";
import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  ...config.get("db"),
  models: [__dirname + "/models/**/*.model.*"],
});
