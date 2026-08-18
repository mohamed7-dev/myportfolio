import "reflect-metadata";
import { achievementService } from "@/services/domain/achievement.service";
import { careerService } from "@/services/domain/career.service";
import { contactMethodService } from "@/services/domain/contact-method.service";
import { educationService } from "@/services/domain/education.service";
import { profileService } from "@/services/domain/profile.service";
import { projectService } from "@/services/domain/project.service";
import { skillService } from "@/services/domain/skill.service";
import { wrapService } from "../../api/common/create-router";
import { ormService } from "../orm.service";
import { seedAllAssets as _seedAllAssets } from "./seed-asset";

async function seedAdmin() {
  const ensureAdmin = wrapService({
    authenticatedOnly: false,
    handler: profileService.initAdmin,
  });

  const result = await ensureAdmin();
  console.log("[Profile]: ", result);

  return result;
}

async function main() {
  if (process.env.NODE_ENV === "development") {
    const ds = await ormService.getDataSource();
    await ds.dropDatabase();
    // Recreate the schema
    await ds.synchronize();

    // -----------------------------------------------------------------------
    // SuperAdmin
    // -----------------------------------------------------------------------

    const profile = await seedAdmin();

    /*
     * Assets MUST be seeded first.
     *
     * The returned map remains in memory and is used by all subsequent
     * entity seeders.
     */
    const seedAllAssets = wrapService({
      authenticatedOnly: false,
      handler: _seedAllAssets,
    });
    const assets = await seedAllAssets();

    console.log("[AssetsMap]: ", assets);

    // -----------------------------------------------------------------------
    // Profile Assets
    // -----------------------------------------------------------------------
    const updateProfile = wrapService({
      authenticatedOnly: false,
      handler: profileService.update.bind(profileService),
    });

    if (profile.id) {
      await updateProfile({
        id: profile.id,
        featuredAssetId: assets.profile.get("me")?.featuredAsset.id,
        assetIds: assets.profile.get("me")?.assets.map((asset) => asset.id),
      });
      console.log("[Profile Assets]: ", "Updated Successfully");
    }

    // -----------------------------------------------------------------------
    // Skills
    // -----------------------------------------------------------------------

    const seedSkills = wrapService({
      authenticatedOnly: false,
      handler: skillService.seedSkills,
    });

    const skills = await seedSkills(assets.skills);

    console.log("[Skills]: ", skills);

    // -----------------------------------------------------------------------
    // Careers
    // -----------------------------------------------------------------------
    const seedCareers = wrapService({
      authenticatedOnly: false,
      handler: careerService.seedCareers,
    });

    const careers = await seedCareers(assets.careers);

    console.log("[Careers]: ", careers);

    // -----------------------------------------------------------------------
    // Education
    // -----------------------------------------------------------------------
    const seedEducation = wrapService({
      authenticatedOnly: false,
      handler: educationService.seedEducation,
    });

    const education = await seedEducation(assets.education);

    console.log("[Education]: ", education);

    // -----------------------------------------------------------------------
    // Achievements
    // -----------------------------------------------------------------------

    const seedAchievements = wrapService({
      authenticatedOnly: false,
      handler: achievementService.seedAchievements,
    });
    const achievements = await seedAchievements(assets.achievements);

    console.log("[Achievements]: ", achievements);

    // -----------------------------------------------------------------------
    // Projects
    // -----------------------------------------------------------------------

    const seedProjects = wrapService({
      authenticatedOnly: false,
      handler: projectService.seedProjects,
    });
    const projects = await seedProjects(
      assets.projects,
      skills,
      careers,
      education,
      achievements,
    );

    console.log("[Projects]: ", projects);

    // -----------------------------------------------------------------------
    // Contact Methods
    // -----------------------------------------------------------------------

    const seedContactMethods = wrapService({
      authenticatedOnly: false,
      handler: contactMethodService.seedContactMethods,
    });
    const contactMethods = await seedContactMethods(assets.contactMethods);

    console.log("[Contact Methods]: ", contactMethods);
  } else if (process.env.NODE_ENV === "production") {
    // -----------------------------------------------------------------------
    // SuperAdmin
    // -----------------------------------------------------------------------
    await seedAdmin();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
