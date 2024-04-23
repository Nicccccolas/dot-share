import { Server } from "http";
import app from "./app";
import config from "./config/config";
import logger from "./config/logger";
import prisma from "./config/prisma";

let server: Server;
prisma.$connect().then(() => {
  logger.info("Connected to PostgreSQL database");
  server = app.listen(config.port, () => {
    logger.info(`Listening to port: ${config.port}`);
  });
});
