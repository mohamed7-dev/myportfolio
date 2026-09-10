import { notFound } from "next/navigation";
import { wrapService } from "@/api/common/create-router";
import { EntityAssetsFormField } from "@/components/data-input/entity-assets-form-field";
import { Page, PageTitle } from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { PendingSubmitButton } from "@/components/shared/pending-submit-button";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type FindOneProjectOutputSchema,
  findOneProjectOutputSchema,
} from "@/lib/dto/project";
import { validateOutput } from "@/lib/helpers/validate-output";
import { projectService } from "@/services/domain/project.service";
import { ProjectForm } from "./_components/project-form";
import { ProjectFormAchievementsField } from "./_components/project-form-achievements-field";
import { ProjectFormCareerField } from "./_components/project-form-career-field";
import { ProjectFormEducationField } from "./_components/project-form-edu-field";
import { ProjectFormMainFields } from "./_components/project-form-main-fields";
import { ProjectFormSkillsField } from "./_components/project-form-skills-form";
import { ProjectFormStatusField } from "./_components/project-form-status-field";

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
        career: true,
        education: true,
        skills: true,
        achievements: true,
      },
    );
    project = validateOutput(result, findOneProjectOutputSchema);
  }

  if (!project && !creatingNewEntity) {
    notFound();
  }

  return (
    <ProjectForm initialValues={project}>
      <Page pageId="dashboard-project">
        <PageTitle pageTitleBlockId="dashboard-project-title">
          {creatingNewEntity ? "New Project" : "Update Project"}
        </PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-project-action-bar">
          <PageActionBarItem actionBarItemBlockId="save-dashboard-project">
            <PendingSubmitButton
              formName="project-form"
              createEntityLabel="create project"
              updateEntityLabel="update project"
            />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="info">
            <ProjectFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="assets">
            <EntityAssetsFormField
              entityAssets={project?.assets ?? []}
              featuredAsset={project?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="status">
            <ProjectFormStatusField />
          </PageBlock>
          <PageBlock column="side" id="career">
            <ProjectFormCareerField />
          </PageBlock>
          <PageBlock column="side" id="education">
            <ProjectFormEducationField />
          </PageBlock>
          <PageBlock column="side" id="achievements">
            <ProjectFormAchievementsField />
          </PageBlock>
          <PageBlock column="side" id="skills">
            <ProjectFormSkillsField />
          </PageBlock>
        </PageLayout>
      </Page>
    </ProjectForm>
  );
}
