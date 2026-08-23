import { IsNull } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import { Achievement } from "@/orm/entities/achievement/achievement.entity";
import { Career } from "@/orm/entities/career/career.entity";
import { Education } from "@/orm/entities/education/education.entity";
import { Project } from "@/orm/entities/project/project.entity";
import { Skill } from "@/orm/entities/skill/skill.entity";
import { SkillTranslation } from "@/orm/entities/skill/skill-translation.entity";
import { ormService } from "@/orm/orm.service";

class InsightsService {
  public async projects(ctx: RequestContext) {
    const repo = await ormService.getRepository(ctx, Project);

    const result = await repo
      .createQueryBuilder("project")
      .select("COUNT(project.id)", "total")
      .addSelect(
        "SUM(CASE WHEN project.finished = :finished THEN 1 ELSE 0 END)",
        "finished",
      )
      .addSelect(
        "SUM(CASE WHEN project.enabled = :enabled THEN 1 ELSE 0 END)",
        "enabled",
      )
      .where({ deletedAt: IsNull() })
      .setParameters({ finished: true, enabled: true })
      .getRawOne<{
        total: string;
        finished: string;
        enabled: string;
      }>();

    return {
      total: Number(result?.total ?? 0),
      finished: Number(result?.finished ?? 0),
      enabled: Number(result?.enabled ?? 0),
    };
  }

  public async achievements(ctx: RequestContext) {
    const repo = await ormService.getRepository(ctx, Achievement);

    return {
      total: await repo.count(),
    };
  }

  public async careers(ctx: RequestContext) {
    const repo = await ormService.getRepository(ctx, Career);

    const result = await repo
      .createQueryBuilder("career")
      .select("COUNT(career.id)", "total")
      .addSelect(
        "SUM(CASE WHEN career.mode = :onSite THEN 1 ELSE 0 END)",
        "onSite",
      )
      .addSelect(
        "SUM(CASE WHEN career.mode = :remote THEN 1 ELSE 0 END)",
        "remote",
      )
      .setParameters({ onSite: "ON_SITE", remote: "REMOTE" })
      .getRawOne<{
        total: string;
        onSite: string;
        remote: string;
      }>();

    return {
      total: Number(result?.total ?? 0),
      onSite: Number(result?.onSite ?? 0),
      remote: Number(result?.remote ?? 0),
    };
  }

  public async education(ctx: RequestContext) {
    const repo = await ormService.getRepository(ctx, Education);

    return {
      total: await repo.count(),
    };
  }

  public async skills(ctx: RequestContext) {
    const repo = await ormService.getRepository(ctx, Skill);

    const result = await repo
      .createQueryBuilder("skill")
      .innerJoin(
        SkillTranslation,
        "translation",
        "translation.baseId = skill.id AND translation.languageCode = :languageCode",
        { languageCode: "en" },
      )
      .leftJoin("skill.projects", "project", "project.deletedAt IS NULL")
      .select("skill.id", "id")
      .addSelect("translation.name", "name")
      .addSelect("COUNT(project.id)", "projectsCount")
      .groupBy("skill.id")
      .addGroupBy("translation.name")
      .orderBy("COUNT(project.id)", "DESC")
      .addOrderBy("translation.name", "ASC")
      .limit(5)
      .getRawMany<{
        id: string;
        name: string;
        projectsCount: string;
      }>();

    return {
      total: await repo.count(),
      topUsed: result.map((skill) => ({
        id: skill.id,
        name: skill.name,
        projectsCount: Number(skill.projectsCount),
      })),
    };
  }
}

export const insightsService = new InsightsService();
