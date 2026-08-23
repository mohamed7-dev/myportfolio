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
import { skillListOutputSchema } from "@/lib/dto/skill";
import { validateOutput } from "@/lib/helpers/validate-output";
import { skillService } from "@/services/domain/skill.service";
import { SkillsDataTable } from "./_components/skills-data-table";

export const metadata = {
  title: "Dashboard - Skills",
  description: "Manage portfolio skills",
};

export default async function SkillsListPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    page: string;
    name: string;
    category: string;
  }>;
}) {
  const { page = 1, pageSize = 24, name, category } = await searchParams;
  const find = wrapService({
    authenticatedOnly: true,
    handler: skillService.find.bind(skillService),
  });

  const result = await find({
    take: Number(pageSize),
    skip: (Number(page) - 1) * Number(pageSize),
    filter: {
      ...(name && { name: { contains: name } }),
      ...(category && { category: { equals: category } }),
    },
  });

  const skills = validateOutput(result, skillListOutputSchema);

  return (
    <Page pageId="dashboard-skills">
      <PageTitle pageTitleBlockId="dashboard-skills-title">Skills</PageTitle>
      <PageActionBar pageActionBarBlockId="dashboard-skills-action-bar">
        <PageActionBarItem actionBarItemBlockId="add-new-skill">
          <Button>
            <Link href={"/dashboard/skills/new"}>Add New Skill</Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="full" id="skill-list">
          <SkillsDataTable
            skills={skills?.items}
            totalItemsCount={skills.itemsCount}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
