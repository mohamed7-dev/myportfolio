import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1787318749186 implements MigrationInterface {
    name = 'Initial1787318749186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "career" ADD "isFeatured" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "isFeatured"`);
    }

}
