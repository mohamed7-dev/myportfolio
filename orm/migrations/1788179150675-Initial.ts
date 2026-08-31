import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1788179150675 implements MigrationInterface {
    name = 'Initial1788179150675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_232f8e85d7633bd6ddfad42169" ON "session"  ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d93e7137d3924bd95fc94d3b0" ON "session"  ("profileId") `);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_1d93e7137d3924bd95fc94d3b07" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_1d93e7137d3924bd95fc94d3b07"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "token" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d93e7137d3924bd95fc94d3b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_232f8e85d7633bd6ddfad42169"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
