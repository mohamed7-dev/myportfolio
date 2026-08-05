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
import { type Project, project as projectSchema } from "@/lib/dto/project";
import { validateOutput } from "@/lib/helpers/validate-output";
import { achievementService } from "@/services/domain/achievement.service";
import { careerService } from "@/services/domain/career.service";
import { educationService } from "@/services/domain/education.service";
import { projectService } from "@/services/domain/project.service";
import { ProjectForm } from "./_components/project-form";
import { ProjectFormAchievementsField } from "./_components/project-form-achievements-field";
import { ProjectFormAssetField } from "./_components/project-form-asset-field";
import { ProjectFormCareerField } from "./_components/project-form-career-field";
import { ProjectFormEducationField } from "./_components/project-form-edu-field";
import { ProjectFormMainFields } from "./_components/project-form-main-fields";
import { ProjectFormStatusField } from "./_components/project-form-status-field";
import { SubmitButton } from "./_components/submit-button";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creatingNewEntity = id === NEW_ENTITY_PATH;

  let project: Project | undefined;
  if (!creatingNewEntity) {
    const findOne = wrapService({
      authenticatedOnly: true,
      handler: projectService.findOne,
    });
    const result = await findOne({ id });
    project = validateOutput(result, projectSchema);
  }

  if (!project && !creatingNewEntity) {
    notFound();
  }

  const find = wrapService({
    authenticatedOnly: true,
    handler: careerService.find,
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
    handler: educationService.find,
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
    handler: achievementService.find,
  });
  const achievementsResult = await findAchievements({});
  const achievements = validateOutput(
    achievementsResult,
    achievementListOutputSchema,
  );

  return (
    <ProjectForm initialValues={project}>
      <Page pageId="new-project">
        <PageTitle pageTitleBlockName="project-detail-page-title">
          {creatingNewEntity ? "New Project" : "Update Project"}
        </PageTitle>
        <PageActionBar pageActionBarBlockName="new-project-page-action-bar">
          <PageActionBarItem actionBarItemBlockName="new-project-page-action-bar-item">
            <SubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="project-info">
            <ProjectFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="project-assets">
            <ProjectFormAssetField
              projectAssets={project?.assets ?? []}
              featuredAsset={project?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="project-status">
            <ProjectFormStatusField />
          </PageBlock>
          <PageBlock column="side" id="project-career">
            <ProjectFormCareerField careers={careers} />
          </PageBlock>
          <PageBlock column="side" id="project-education">
            <ProjectFormEducationField educationItems={educationItems} />
          </PageBlock>
          <PageBlock column="side" id="project-achievements">
            <ProjectFormAchievementsField achievements={achievements.items} />
          </PageBlock>
        </PageLayout>
      </Page>
    </ProjectForm>
  );
}
