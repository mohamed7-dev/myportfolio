import { setStaticParamsLocale } from "next-international/server";
import React from "react";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { getScopedI18n } from "@/i18n/server";
import { visitorService } from "@/services/domain/visitor.service";
import { Cards } from "./_components/cards";
import { CareerCard } from "./_components/career-card";
import { FeaturedCareer } from "./_components/featured-career";
import { FeaturedWork } from "./_components/featured-work";
import { HomePageHeader } from "./_components/header";
import { ProjectCard } from "./_components/project-card";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const i18n = await getScopedI18n("home");
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
            <ProjectCard>
              <React.Suspense fallback={<DynamicLoader />}>
                <FeaturedWork />
              </React.Suspense>
            </ProjectCard>
            <CareerCard>
              <React.Suspense fallback={<DynamicLoader />}>
                <FeaturedCareer />
              </React.Suspense>
            </CareerCard>
          </Cards>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
