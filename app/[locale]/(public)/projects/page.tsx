import { getTranslations } from "next-intl/server";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";

export default async function ProjectsPage() {
  const i18n = await getTranslations("projects");
  return (
    <Page pageId="public-projects-page">
      <PageTitle pageTitleBlockName="public-projects-page-title">
        {i18n("title")}
      </PageTitle>
      <PageLayout alternate={true}>
        <PageBlock column="main" id="card-1">
          Card 1
        </PageBlock>
        <PageBlock column="side" id="card-2">
          Card 2
        </PageBlock>
        <PageBlock column="main" id="card-3">
          Card 3
        </PageBlock>
        <PageBlock column="side" id="card-3">
          Card 4
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
