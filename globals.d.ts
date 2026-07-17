import type { DataSource } from "typeorm";

declare global {
  var __typeorm: DataSource | undefined;
}
