import { notFound } from "next/navigation";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import { achievementListOutputSchema } from "@/lib/dto/achievement";
import { careerListOutputSchema } from "@/lib/dto/career";
import { educationListOutputSchema } from "@/lib/dto/education";
import {
  type FindOneProjectOutputSchema,
  findOneProjectOutputSchema,
} from "@/lib/dto/project";
import { skillListOutputSchema } from "@/lib/dto/skill";
import { validateOutput } from "@/lib/helpers/validate-output";
import { achievementService } from "@/services/domain/achievement.service";
import { careerService } from "@/services/domain/career.service";
import { educationService } from "@/services/domain/education.service";
import { projectService } from "@/services/domain/project.service";
import { skillService } from "@/services/domain/skill.service";
import { ProjectForm } from "./_components/project-form";
import { ProjectFormAchievementsField } from "./_components/project-form-achievements-field";
import { ProjectFormAssetField } from "./_components/project-form-asset-field";
import { ProjectFormCareerField } from "./_components/project-form-career-field";
import { ProjectFormEducationField } from "./_components/project-form-edu-field";
import { ProjectFormMainFields } from "./_components/project-form-main-fields";
import { ProjectFormSkillsField } from "./_components/project-form-skills-form";
import { ProjectFormStatusField } from "./_components/project-form-status-field";
import { SubmitButton } from "./_components/submit-button";

export const metadata = {
  title: "Dashboard - Edit Project",
  description: "Edit a portfolio project",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creatingNewEntity = id === NEW_ENTITY_PATH;

  let project: FindOneProjectOutputSchema | undefined;
  if (!creatingNewEntity) {
    const findOne = wrapService({
      authenticatedOnly: true,
      handler: projectService.findOne.bind(projectService),
    });
    const result = await findOne(
      { id },
      {
        career: { featuredAsset: true },
        education: { featuredAsset: true },
        skills: { featuredAsset: true },
      },
    );
    project = validateOutput(result, findOneProjectOutputSchema);
  }

  if (!project && !creatingNewEntity) {
    notFound();
  }

  const find = wrapService({
    authenticatedOnly: true,
    handler: careerService.find.bind(careerService),
  });
  const result = await find({});
  const careers = validateOutput(result, careerListOutputSchema).items.map(
    (item) => ({
      ...item,
      label: item.name,
    }),
  );

  const findEdu = wrapService({
    authenticatedOnly: true,
    handler: educationService.find.bind(educationService),
  });
  const eduResult = await findEdu({});
  const educationItems = validateOutput(
    eduResult,
    educationListOutputSchema,
  ).items.map((item) => ({
    ...item,
    label: item.school,
  }));

  const findAchievements = wrapService({
    authenticatedOnly: true,
    handler: achievementService.find.bind(achievementService),
  });
  const achievementsResult = await findAchievements({});
  const achievements = validateOutput(
    achievementsResult,
    achievementListOutputSchema,
  );

  const findSkills = wrapService({
    authenticatedOnly: true,
    handler: skillService.find.bind(skillService),
  });
  const skillsResult = await findSkills({});
  const skills = validateOutput(skillsResult, skillListOutputSchema);

  return (
    <ProjectForm initialValues={project}>
      <Page pageId="dashboard-project">
        <PageTitle pageTitleBlockId="dashboard-project-title">
          {creatingNewEntity ? "New Project" : "Update Project"}
        </PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-project-action-bar">
          <PageActionBarItem actionBarItemBlockId="save-dashboard-project">
            <SubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="info">
            <ProjectFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="assets">
            <ProjectFormAssetField
              projectAssets={project?.assets ?? []}
              featuredAsset={project?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="status">
            <ProjectFormStatusField />
          </PageBlock>
          <PageBlock column="side" id="career">
            <ProjectFormCareerField careers={careers} />
          </PageBlock>
          <PageBlock column="side" id="education">
            <ProjectFormEducationField educationItems={educationItems} />
          </PageBlock>
          <PageBlock column="side" id="achievements">
            <ProjectFormAchievementsField achievements={achievements.items} />
          </PageBlock>
          <PageBlock column="side" id="skills">
            <ProjectFormSkillsField skills={skills.items} />
          </PageBlock>
        </PageLayout>
      </Page>
    </ProjectForm>
  );
}
