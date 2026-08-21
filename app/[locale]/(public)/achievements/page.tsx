import { setStaticParamsLocale } from "next-international/server";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageDescription,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { getScopedI18n } from "@/i18n/server";
import { visitorService } from "@/services/domain/visitor.service";
import { AchievementCard } from "./_components/achievement-card";

export default async function AchievementsPage({
  params,
}: PageProps<"/[locale]/achievements">) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const i18n = await getScopedI18n("achievements");

  const getAchievements = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getAchievements,
  });

  const result = await getAchievements();

  return (
    <Page pageId="public-achievements">
      <PageTitle pageTitleBlockId="public-achievements-title">
        {i18n("title")}
      </PageTitle>
      <PageDescription pageDescriptionBlockId="public-achievements-description">
        {i18n("description")}
      </PageDescription>
      <PageLayout>
        <PageBlock column="full" id="achievements-list">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.items.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
