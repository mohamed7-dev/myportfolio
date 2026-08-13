import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1786659730871 implements MigrationInterface {
    name = 'Initial1786659730871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "career" DROP CONSTRAINT "FK_30d6b481f6c083cf46ab41cc09d"`);
        await queryRunner.query(`ALTER TABLE "contact_method" DROP CONSTRAINT "FK_c52a1b74f55fcf06ea411a46c51"`);
        await queryRunner.query(`ALTER TABLE "contact_method" ADD "enabled" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "contact_method" ADD "primary" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "career" ADD CONSTRAINT "FK_30d6b481f6c083cf46ab41cc09d" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_method" ADD CONSTRAINT "FK_c52a1b74f55fcf06ea411a46c51" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_method" DROP CONSTRAINT "FK_c52a1b74f55fcf06ea411a46c51"`);
        await queryRunner.query(`ALTER TABLE "career" DROP CONSTRAINT "FK_30d6b481f6c083cf46ab41cc09d"`);
        await queryRunner.query(`ALTER TABLE "contact_method" DROP COLUMN "primary"`);
        await queryRunner.query(`ALTER TABLE "contact_method" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "contact_method" ADD CONSTRAINT "FK_c52a1b74f55fcf06ea411a46c51" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "career" ADD CONSTRAINT "FK_30d6b481f6c083cf46ab41cc09d" FOREIGN KEY ("featuredAssetId") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
