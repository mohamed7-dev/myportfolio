import Link from "next/link";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Button } from "@/components/ui/button";
import { SortDirection } from "@/lib/dto/common";
import { projectListOutputSchema } from "@/lib/dto/project";
import { validateOutput } from "@/lib/helpers/validate-output";
import { projectService } from "@/services/domain/project.service";
import { ProjectsDataTable } from "./_components/projects-data-table";

export const metadata = {
  title: "Dashboard - Projects",
  description: "Manage portfolio projects",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    page: string;
    includeSoftDeleted: string;
    name: string;
    enabled: string;
    liveDemoUrl: string;
    repoUrl: string;
  }>;
}) {
  const {
    page = 1,
    pageSize = 24,
    includeSoftDeleted,
    name,
    enabled,
    liveDemoUrl,
    repoUrl,
  } = await searchParams;
  const find = wrapService({
    authenticatedOnly: true,
    handler: projectService.find.bind(projectService),
  });

  const result = await find({
    take: Number(pageSize),
    skip: (Number(page) - 1) * Number(pageSize),
    includeSoftDeleted: includeSoftDeleted === "true" ? true : false,
    filter: {
      ...(name && { name: { contains: name } }),
      ...(enabled !== undefined && {
        enabled: {
          equals: enabled !== undefined ? Boolean(enabled) : true,
        },
      }),
      ...(liveDemoUrl && { liveDemoUrl: { contains: liveDemoUrl } }),
      ...(repoUrl && { repoUrl: { contains: repoUrl } }),
    },
    sort: {
      updatedAt: SortDirection.DESC,
    },
  });
  const projects = validateOutput(result, projectListOutputSchema);
  return (
    <Page pageId="project-list-page">
      <PageTitle pageTitleBlockId="project-list-page-title">Projects</PageTitle>
      <PageActionBar pageActionBarBlockId="project-list-page-action-bar">
        <PageActionBarItem actionBarItemBlockId="new-project-action-bar-item">
          <Button>
            <Link href={"/dashboard/projects/new"}>Add New Project</Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="full" id="project-list-data-table">
          <ProjectsDataTable
            projects={projects?.items}
            totalItemsCount={projects.itemsCount}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
