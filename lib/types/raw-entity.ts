import type { AppEntity } from "@/orm/entities/app-entity";

export type RawEntity<Entity extends AppEntity> = Omit<Entity, "initialize">;
