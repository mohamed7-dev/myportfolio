import { setStaticParamsLocale } from "next-international/server";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { getScopedI18n } from "@/i18n/server";
import { visitorService } from "@/services/domain/visitor.service";
import { ProjectCard } from "./_components/project-card";

export default async function ProjectsPage({
  params,
}: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const i18n = await getScopedI18n("projects");

  const getPublicProjects = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getProjects,
  });

  const result = await getPublicProjects();

  return (
    <Page pageId="public-projects">
      <PageTitle pageTitleBlockId="public-projects-title">
        {i18n("title")}
      </PageTitle>
      <PageLayout>
        <PageBlock column="full" id="projects-cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {result.items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
