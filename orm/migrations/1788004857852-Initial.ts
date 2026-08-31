import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1788004857852 implements MigrationInterface {
    name = 'Initial1788004857852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_achievements_achievement" DROP CONSTRAINT "FK_f45b8d8232b5f5edb7ccc2b3faf"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "cvAssetId" character varying`);
        await queryRunner.query(`ALTER TABLE "project_achievements_achievement" ADD CONSTRAINT "FK_f45b8d8232b5f5edb7ccc2b3faf" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_achievements_achievement" DROP CONSTRAINT "FK_f45b8d8232b5f5edb7ccc2b3faf"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "cvAssetId"`);
        await queryRunner.query(`ALTER TABLE "project_achievements_achievement" ADD CONSTRAINT "FK_f45b8d8232b5f5edb7ccc2b3faf" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
