import { resolve } from "node:path";
import { DataSource } from "typeorm";
import { isProductionMode, registerEnv } from "@/lib/helpers/env";
import { entitiesMap } from "./entities/entities-map";

registerEnv();

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
  ...(dbPort ? { port: dbPort } : {}),
  username: dbUser,
  password: dbPassword,
  database: dbName,
  schema: dbSchema,
  entities: Object.values(entitiesMap),
  migrations: [resolve(__dirname, "./migrations/*.ts")],
  synchronize: !isProductionMode(),
  logging: false,
  // connectTimeoutMS: 5000,
  ssl: dbSSL ? dbSSL : undefined,
  extra: {
    enableChannelBinding: dbChannelBinding,
  },
});
