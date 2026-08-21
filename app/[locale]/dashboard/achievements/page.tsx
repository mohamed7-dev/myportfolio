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
    pageSize: string;
    page: string;
    name: string;
  }>;
}) {
  const { page = 1, pageSize = 24, name } = await searchParams;

  const find = wrapService({
    authenticatedOnly: true,
    handler: achievementService.find.bind(achievementService),
  });

  const result = await find({
    take: Number(pageSize),
    skip: (Number(page) - 1) * Number(pageSize),
    filter: {
      ...(name && { name: { contains: name } }),
    },
  });

  const achievements = validateOutput(result, achievementListOutputSchema);

  return (
    <Page pageId="dashboard-achievements">
      <PageTitle pageTitleBlockId="dashboard-achievements-title">
        Achievements
      </PageTitle>
      <PageActionBar pageActionBarBlockId="dashboard-achievements-action-bar">
        <PageActionBarItem actionBarItemBlockId="add-new-achievement">
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
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
