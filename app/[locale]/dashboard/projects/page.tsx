import Link from "next/link";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Button } from "@/components/ui/button";
import { projectListOutputSchema } from "@/lib/dto/project";
import { validateOutput } from "@/lib/helpers/validate-output";
import { projectService } from "@/services/project.service";
import { ProjectsDataTable } from "./_components/projects-data-table";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ pageSize: number; skip: number }>;
}) {
  const { skip, pageSize } = await searchParams;
  const result = await projectService().projects({ take: pageSize, skip });

  const projects = validateOutput(result, projectListOutputSchema);

  return (
    <Page pageId="projects">
      <PageTitle pageTitleBlockName="projects-page-title">Projects</PageTitle>
      <PageActionBar pageActionBarBlockName="projects-page-action-bar">
        <PageActionBarItem actionBarItemBlockName="create-project-action-bar-item">
          <Button>
            <Link href={"/dashboard/projects/new"}>Create Project</Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="full" id="project-list">
          <ProjectsDataTable
            projects={projects?.items}
            totalItemsCount={projects.itemsCount}
            pageSize={pageSize}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
