import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1787007326291 implements MigrationInterface {
    name = 'Initial1787007326291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_990db285d0c95e42bd78ceb8bc4"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_b892b227386b953fd1ec49f93e9"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_2ee9d5da2276135e84f55c93378"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_e030e28dffd0484ea9a6a1b586e"`);
        await queryRunner.query(`ALTER TABLE "achievement" DROP CONSTRAINT "FK_890633771c8d37af6954fb82fde"`);
        await queryRunner.query(`CREATE TABLE "asset_upload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sourceFileLocation" text NOT NULL, "previewFileLocation" text NOT NULL, "sourceFileName" character varying(255) NOT NULL, "sourceMimeType" character varying(255) NOT NULL, "sourceSize" bigint NOT NULL, "previewMimeType" character varying(255) NOT NULL, "previewSize" bigint NOT NULL, "sourceResourceType" character varying NOT NULL, "previewResourceType" character varying NOT NULL, "status" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "assetId" uuid, CONSTRAINT "REL_9509c37077dec0b3c3c87e2038" UNIQUE ("assetId"), CONSTRAINT "PK_e9dcbc25119f4bd725a40055ff3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_331e505eb9e7584aa5c5b21858" ON "asset_upload"  ("expiresAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_eaabd5aee28c28ff2c964d15d6" ON "asset_upload"  ("status") `);
        await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "sourceFileKey"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "previewFileKey"`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_990db285d0c95e42bd78ceb8bc4" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_b892b227386b953fd1ec49f93e9" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_2ee9d5da2276135e84f55c93378" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_e030e28dffd0484ea9a6a1b586e" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement" ADD CONSTRAINT "FK_890633771c8d37af6954fb82fde" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_upload" ADD CONSTRAINT "FK_9509c37077dec0b3c3c87e2038a" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_upload" DROP CONSTRAINT "FK_9509c37077dec0b3c3c87e2038a"`);
        await queryRunner.query(`ALTER TABLE "achievement" DROP CONSTRAINT "FK_890633771c8d37af6954fb82fde"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_e030e28dffd0484ea9a6a1b586e"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_2ee9d5da2276135e84f55c93378"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_b892b227386b953fd1ec49f93e9"`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_990db285d0c95e42bd78ceb8bc4"`);
        await queryRunner.query(`ALTER TABLE "asset" ADD "previewFileKey" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "asset" ADD "sourceFileKey" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eaabd5aee28c28ff2c964d15d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_331e505eb9e7584aa5c5b21858"`);
        await queryRunner.query(`DROP TABLE "asset_upload"`);
        await queryRunner.query(`ALTER TABLE "achievement" ADD CONSTRAINT "FK_890633771c8d37af6954fb82fde" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_e030e28dffd0484ea9a6a1b586e" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_2ee9d5da2276135e84f55c93378" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_b892b227386b953fd1ec49f93e9" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_990db285d0c95e42bd78ceb8bc4" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
