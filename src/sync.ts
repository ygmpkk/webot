import { sequelize } from "./db";

const main = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: false });
  console.log("Succesfuly connected to db.");
};

main();
