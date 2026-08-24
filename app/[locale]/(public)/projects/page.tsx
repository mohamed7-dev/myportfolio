import type { Metadata } from "next";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageDescription,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { getCurrentLocale, getScopedI18n } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { visitorService } from "@/services/domain/visitor.service";
import { PublicSidebarTrigger } from "../_components/public-sidebar-trigger";
import { ProjectCard } from "./_components/project-card";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const i18n = await getScopedI18n("projects");
  return {
    title: i18n("title"),
    description: i18n("description"),
  };
}

const getPublicProjects = localizedCache(
  async (locale) => {
    const getPublicProjects = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getProjects,
      ctx: { params: Promise.resolve({ locale }) },
    });

    const result = await getPublicProjects();

    return result;
  },
  cacheKeys.publicProjects,
  { revalidate: 3600, tags: cacheKeys.publicProjects },
);

export default async function ProjectsPage() {
  const i18n = await getScopedI18n("projects");
  const result = await getPublicProjects(await getCurrentLocale());
  const sorted = result.items.sort((a, b) => (a === b ? 0 : a ? -1 : 1));
  return (
    <Page pageId="public-projects">
      <PageTitle pageTitleBlockId="public-projects-title">
        {i18n("title")}
      </PageTitle>
      <PageActionBar pageActionBarBlockId="public-projects-action-bar">
        <PageActionBarItem actionBarItemBlockId="sidebar-trigger">
          <PublicSidebarTrigger />
        </PageActionBarItem>
      </PageActionBar>
      <PageDescription pageDescriptionBlockId="projects-description">
        {i18n("description")}
      </PageDescription>
      <PageLayout>
        <PageBlock column="full" id="projects-cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sorted.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
