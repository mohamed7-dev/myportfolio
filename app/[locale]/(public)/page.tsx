import { getTranslations } from "next-intl/server";
import React from "react";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { Cards } from "./_components/cards";
import { FeaturedWork } from "./_components/featured-work";
import { HomePageHeader } from "./_components/header";
import { Skills } from "./_components/skills";

export default async function HomePage() {
  const i18n = await getTranslations("home");
  return (
    <Page pageId="home">
      <PageTitle pageTitleBlockId="home-title">
        <span className="capitalize">{i18n("welcome")}</span>, 👋
      </PageTitle>
      <PageLayout>
        <PageBlock id="header" column="full">
          <HomePageHeader>
            <React.Suspense fallback={<DynamicLoader />}>
              <Skills />
            </React.Suspense>
          </HomePageHeader>
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
