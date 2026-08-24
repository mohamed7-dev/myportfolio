import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1787585488527 implements MigrationInterface {
    name = 'Initial1787585488527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_asset" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_asset" DROP COLUMN "type"`);
    }

}
