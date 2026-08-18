import { getTranslations } from "next-intl/server";
import React from "react";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { visitorService } from "@/services/domain/visitor.service";
import { Cards } from "./_components/cards";
import { FeaturedWork } from "./_components/featured-work";
import { HomePageHeader } from "./_components/header";

export default async function HomePage() {
  const i18n = await getTranslations("home");
  const getFeaturedSkills = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getFeaturedSkills,
  });

  const skills = await getFeaturedSkills();

  return (
    <Page pageId="home">
      <PageTitle pageTitleBlockId="home-title">
        <span className="capitalize">{i18n("welcome")}</span>, 👋
      </PageTitle>
      <PageLayout>
        <PageBlock id="header" column="full">
          <HomePageHeader skills={skills.items} />
        </PageBlock>
        <PageBlock id="cards" column="full">
          <Cards>
            <React.Suspense fallback={<DynamicLoader />}>
              <FeaturedWork />
            </React.Suspense>
          </Cards>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
