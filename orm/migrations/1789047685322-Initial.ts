import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1789047685322 implements MigrationInterface {
    name = 'Initial1789047685322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievement" DROP CONSTRAINT "FK_5ecea8e22ed92dd6a1da055feca"`);
        await queryRunner.query(`CREATE TABLE "career_achievements_achievement" ("careerId" uuid NOT NULL, "achievementId" uuid NOT NULL, CONSTRAINT "PK_759914fc88e197bb26d3c50af2c" PRIMARY KEY ("careerId", "achievementId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_689627cb8bbb4aaa8d907e851c" ON "career_achievements_achievement"  ("careerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf285c6e8011efd46f8f38c235" ON "career_achievements_achievement"  ("achievementId") `);
        await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "careerId"`);
        await queryRunner.query(`ALTER TABLE "career_achievements_achievement" ADD CONSTRAINT "FK_689627cb8bbb4aaa8d907e851cf" FOREIGN KEY ("careerId") REFERENCES "career"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "career_achievements_achievement" ADD CONSTRAINT "FK_cf285c6e8011efd46f8f38c235e" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "career_achievements_achievement" DROP CONSTRAINT "FK_cf285c6e8011efd46f8f38c235e"`);
        await queryRunner.query(`ALTER TABLE "career_achievements_achievement" DROP CONSTRAINT "FK_689627cb8bbb4aaa8d907e851cf"`);
        await queryRunner.query(`ALTER TABLE "achievement" ADD "careerId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf285c6e8011efd46f8f38c235"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_689627cb8bbb4aaa8d907e851c"`);
        await queryRunner.query(`DROP TABLE "career_achievements_achievement"`);
        await queryRunner.query(`ALTER TABLE "achievement" ADD CONSTRAINT "FK_5ecea8e22ed92dd6a1da055feca" FOREIGN KEY ("careerId") REFERENCES "career"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
