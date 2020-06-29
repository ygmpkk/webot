import config from "rob-config";

export const logger = require("pino")({ ...config.get("logger") });
