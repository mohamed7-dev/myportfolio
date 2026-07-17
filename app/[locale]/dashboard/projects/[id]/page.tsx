import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import { type Project, project as projectSchema } from "@/lib/dto/project";
import { validateOutput } from "@/lib/helpers/validate-output";
import { projectService } from "@/services/project.service";
import { ProjectForm } from "./_components/project-form";
import { ProjectFormAssetField } from "./_components/project-form-asset-field";
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
    // get the project
    const result = await projectService().project(id);
    project = validateOutput(result, projectSchema);
  }

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
              featuredAsset={project?.featuredAsset}
            />
          </PageBlock>
          <PageBlock column="side" id="project-status">
            <ProjectFormStatusField />
          </PageBlock>
        </PageLayout>
      </Page>
    </ProjectForm>
  );
}
