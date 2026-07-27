import Link from "next/link";
import { wrapService } from "@/api/common/create-router";
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
import { projectService } from "@/services/domain/project.service";
import { ProjectsDataTable } from "./_components/projects-data-table";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    skip: string;
    includeSoftDeleted: string;
    name: string;
    enabled: string;
    liveDemoUrl: string;
    repoUrl: string;
  }>;
}) {
  const {
    skip,
    pageSize,
    includeSoftDeleted,
    name,
    enabled,
    liveDemoUrl,
    repoUrl,
  } = await searchParams;
  const find = wrapService({
    authenticatedOnly: true,
    handler: projectService.find,
  });

  const result = await find({
    take: Number(pageSize),
    skip: skip ? Number(skip) : undefined,
    includeSoftDeleted: includeSoftDeleted === "true" ? true : false,
    filter: {
      name: {
        contains: name,
      },
      enabled: {
        equals: Boolean(enabled),
      },
      liveDemoUrl: { contains: liveDemoUrl },
      repoUrl: { contains: repoUrl },
    },
  });

  const projects = validateOutput(result, projectListOutputSchema);

  return (
    <Page pageId="projects">
      <PageTitle pageTitleBlockName="projects-page-title">Projects</PageTitle>
      <PageActionBar pageActionBarBlockName="projects-page-action-bar">
        <PageActionBarItem actionBarItemBlockName="create-project-action-bar-item">
          <Button>
            <Link href={"/dashboard/projects/new"}>Add New Project</Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="full" id="project-list">
          <ProjectsDataTable
            projects={projects?.items}
            totalItemsCount={projects.itemsCount}
            pageSize={Number(pageSize)}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
