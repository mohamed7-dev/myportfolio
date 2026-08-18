import "reflect-metadata";
import { resolve } from "node:path";
import type {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from "typeorm";
import { RequestContext } from "@/api/request-context/request-context";
import { TRANSACTION_MANAGER_KEY } from "@/lib/constants";
import dataSource from "./data-source";

class OrmService {
  dataSource: DataSource | undefined;
  public connectPromise: Promise<DataSource> | undefined;
  migrationPath = resolve(__dirname, "./migrations/*{.ts,.js}");

  public async getDataSource() {
    const connection = await this.connectDb();
    return connection;
  }

  async getRepository<Entity extends ObjectLiteral>(
    target: EntityTarget<Entity>,
  ): Promise<Repository<Entity>>;
  async getRepository<Entity extends ObjectLiteral>(
    ctx: RequestContext | undefined,
    target: EntityTarget<Entity>,
  ): Promise<Repository<Entity>>;
  public async getRepository<Entity extends ObjectLiteral>(
    ctxOrTarget: EntityTarget<Entity> | RequestContext | undefined,
    maybeTarget?: EntityTarget<Entity>,
  ): Promise<Repository<Entity>> {
    const connection = await this.connectDb();

    let repo: Repository<Entity>;

    if (ctxOrTarget instanceof RequestContext) {
      const entityManager = (ctxOrTarget as any)[TRANSACTION_MANAGER_KEY] as
        | EntityManager
        | undefined;
      if (entityManager) {
        repo = entityManager.getRepository(maybeTarget as EntityTarget<Entity>);
      } else {
        repo = connection.getRepository(maybeTarget as EntityTarget<Entity>);
      }
    } else {
      repo = connection.getRepository(ctxOrTarget as EntityTarget<Entity>);
    }
    return repo;
  }

  private async createConnection() {
    const connection = dataSource;

    await connection.initialize();
    return connection;
  }

  private async connectDb() {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    if (!this.connectPromise) {
      this.connectPromise = this.createConnection();
    }

    this.dataSource = await this.connectPromise;
    return this.dataSource;
  }

  async disconnectDb() {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }

    this.dataSource = undefined;
    this.connectPromise = undefined;
  }

  async getDb() {
    return await this.connectDb();
  }
}

export const ormService = new OrmService();
