import "server-only";
import "reflect-metadata";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DataSource,
  type DataSourceOptions,
  type EntityTarget,
  type ObjectLiteral,
} from "typeorm";
import { entitiesMap } from "./entities/entities-map";

const __dirname = dirname(fileURLToPath(import.meta.url));

const migrationPath = resolve(__dirname, "./migrations/*{.ts,.js}");

let dataSource: DataSource | undefined;
let connectPromise: Promise<DataSource> | undefined;

function getConnectionOptions(): DataSourceOptions {
  const connectionString = process.env.DATABASE_URL;

  return {
    type: "postgres",
    url: connectionString,
    host: connectionString ? undefined : process.env.DB_HOST,
    port: connectionString
      ? undefined
      : process.env.DB_PORT
        ? Number(process.env.DB_PORT)
        : undefined,
    username: connectionString ? undefined : process.env.DB_USER_NAME,
    password: connectionString ? undefined : process.env.DB_PASSWORD,
    database: connectionString ? undefined : process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    entities: Object.values(entitiesMap),
    migrations: [migrationPath],
    synchronize: true,
    logging: false,
    ssl:
      process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    extra: {
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    },
  };
}

export async function connectDb() {
  if (dataSource?.isInitialized) {
    return dataSource;
  }

  if (!connectPromise) {
    connectPromise = createConnection();
  }

  dataSource = await connectPromise;
  return dataSource;
}

export async function disconnectDb() {
  if (dataSource?.isInitialized) {
    await dataSource.destroy();
  }

  dataSource = undefined;
  connectPromise = undefined;
}

export async function getDb() {
  return await connectDb();
}

async function createConnection() {
  const options = getConnectionOptions();
  const connection = new DataSource(options);

  await connection.initialize();
  return connection;
}

export const ormService = {
  getRepository: async <Entity extends ObjectLiteral>(
    target: EntityTarget<Entity>,
  ) => {
    const connection = await connectDb();
    return connection.getRepository(target);
  },
};
