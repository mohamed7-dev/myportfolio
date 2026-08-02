import Link from "next/link";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Button } from "@/components/ui/button";
import { achievementListOutputSchema } from "@/lib/dto/achievement";
import { validateOutput } from "@/lib/helpers/validate-output";
import { achievementService } from "@/services/domain/achievement.service";
import { AchievementsDataTable } from "./_components/achievements-data-table";

export default async function AchievementListPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize?: string;
    skip?: string;
    name?: string;
  }>;
}) {
  const { skip, pageSize, name } = await searchParams;

  const find = wrapService({
    authenticatedOnly: true,
    handler: achievementService.find,
  });

  const result = await find({
    take: Number(pageSize),
    skip: skip ? Number(skip) : undefined,
    filter: {
      ...(name && { name: { contains: name } }),
    },
  });

  const achievements = validateOutput(result, achievementListOutputSchema);

  return (
    <Page pageId="achievement-list-page">
      <PageTitle pageTitleBlockName="achievement-list-page-title">
        Achievements
      </PageTitle>
      <PageActionBar pageActionBarBlockName="achievement-list-page-action-bar">
        <PageActionBarItem actionBarItemBlockName="new-achievement-action-bar-item">
          <Button>
            <Link href={"/dashboard/achievements/new"}>
              Add New Achievement
            </Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="full" id="achievement-list">
          <AchievementsDataTable
            achievements={achievements?.items}
            totalItemsCount={achievements.itemsCount}
            pageSize={Number(pageSize)}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
