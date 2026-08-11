import { resolve } from "node:path";
import { config } from "dotenv";
import { DataSource } from "typeorm";

import { entitiesMap } from "./entities/entities-map";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

config({
  path: [
    resolve(__dirname, "../.env.local"),
    isDevelopment
      ? resolve(__dirname, "../.env.development")
      : resolve(__dirname, "../.env.production"),
  ],
});

const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT);
const dbUser = process.env.DB_USER_NAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbSchema = process.env.DB_SCHEMA ?? "public";
const dbSSL = process.env.DB_SSL === "true";
const dbChannelBinding = process.env.DB_CHANNEL_BINDING === "true";

export default new DataSource({
  type: "postgres",
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  schema: dbSchema,
  entities: Object.values(entitiesMap),
  migrations: [resolve(__dirname, "./migrations/*.ts")],
  synchronize: !isProduction,
  logging: false,
  connectTimeoutMS: 5000,
  ssl: dbSSL ? { rejectUnauthorized: false } : undefined,
  extra: {
    enableChannelBinding: dbChannelBinding,
  },
});
