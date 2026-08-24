import type { Metadata } from "next";
import React from "react";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentLocale, getScopedI18n } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { type ProfileAsset, ProfileAssetType } from "@/lib/dto/profile";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { visitorService } from "@/services/domain/visitor.service";
import { Cards } from "./_components/cards";
import { CareerCard } from "./_components/career-card";
import { FeaturedCareer } from "./_components/featured-career";
import { FeaturedWork } from "./_components/featured-work";
import { HomePageHeader } from "./_components/header";
import { ProjectCard } from "./_components/project-card";
import { PublicSidebarTrigger } from "./_components/public-sidebar-trigger";
import { getSuperAdminProfile } from "./layout";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const i18n = await getScopedI18n("home");
  return {
    title: i18n("welcome"),
    description: i18n("cards.currentFocus.title"),
  };
}

const getFeaturedSkills = localizedCache(
  async (locale) => {
    const getFeaturedSkills = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getFeaturedSkills,
      ctx: { params: Promise.resolve({ locale }) },
    });

    const skills = await getFeaturedSkills();
    return skills;
  },
  cacheKeys.publicFeaturedSkills,
  { tags: cacheKeys.publicFeaturedSkills, revalidate: 3600 },
);

export default async function HomePage() {
  const i18n = await getScopedI18n("home");
  const skills = await getFeaturedSkills(await getCurrentLocale());

  const profile = await getSuperAdminProfile(await getCurrentLocale());

  const resolveAsset = (assets?: ProfileAsset[]): ProfileAsset | undefined => {
    if (assets?.length === 1) {
      return assets[0];
    } else if (assets?.length) {
      return assets[Math.floor(Math.random() * assets.length)];
    } else {
      return undefined;
    }
  };

  const filteredCoverAssets = profile.assets
    ?.filter(
      (asset) =>
        asset.asset.id !== profile.avatar?.id &&
        asset.type === ProfileAssetType.COVER,
    )
    .sort((a, b) => a.position - b.position);

  const randomCover = resolveAsset(filteredCoverAssets);

  const filteredPersonalAssets = profile.assets
    ?.filter(
      (asset) =>
        asset.asset.id !== profile.avatar?.id &&
        asset.type === ProfileAssetType.PERSONAL,
    )
    .sort((a, b) => a.position - b.position);

  const randomPersonal = resolveAsset(filteredPersonalAssets);

  return (
    <Page pageId="home">
      <PageTitle pageTitleBlockId="home-title">
        <span className="capitalize">{i18n("welcome")}</span>, 👋
      </PageTitle>
      <PageActionBar pageActionBarBlockId="home-action-bar">
        <PageActionBarItem actionBarItemBlockId="sidebar-trigger">
          <PublicSidebarTrigger />
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock id="header" column="full">
          <HomePageHeader
            skills={skills.items}
            cover={randomCover?.asset}
            personal={randomPersonal?.asset}
          />
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
