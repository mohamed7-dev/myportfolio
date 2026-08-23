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
import { AchievementCard } from "./_components/achievement-card";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const i18n = await getScopedI18n("achievements");
  return {
    title: i18n("title"),
    description: i18n("description"),
  };
}

const getAchievements = localizedCache(
  async (locale) => {
    const getAchievements = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getAchievements,
      ctx: { params: Promise.resolve({ locale }) },
    });
    const result = await getAchievements();
    return result;
  },
  cacheKeys.publicAchievements,
  {
    revalidate: 3600,
    tags: cacheKeys.publicAchievements,
  },
);

export default async function AchievementsPage() {
  const i18n = await getScopedI18n("achievements");
  const result = await getAchievements(await getCurrentLocale());

  return (
    <Page pageId="public-achievements">
      <PageTitle pageTitleBlockId="public-achievements-title">
        {i18n("title")}
      </PageTitle>
      <PageActionBar pageActionBarBlockId="public-achievements-action-bar">
        <PageActionBarItem actionBarItemBlockId="sidebar-trigger">
          <PublicSidebarTrigger />
        </PageActionBarItem>
      </PageActionBar>
      <PageDescription pageDescriptionBlockId="public-achievements-description">
        {i18n("description")}
      </PageDescription>
      <PageLayout>
        <PageBlock column="full" id="achievements-list">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.items.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
