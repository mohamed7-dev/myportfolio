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

export default async function SkillsListPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    skip: string;
    name: string;
    category: string;
  }>;
}) {
  const { skip, pageSize, name, category } = await searchParams;
  const find = wrapService({
    authenticatedOnly: true,
    handler: skillService.find,
  });

  const result = await find({
    take: Number(pageSize),
    skip: skip ? Number(skip) : undefined,
    filter: {
      name: {
        contains: name,
      },
      category: {
        equals: category as any,
      },
    },
  });

  const skills = validateOutput(result, skillListOutputSchema);

  return (
    <Page pageId="skills">
      <PageTitle pageTitleBlockName="skills-page-title">Skills</PageTitle>
      <PageActionBar pageActionBarBlockName="skills-page-action-bar">
        <PageActionBarItem actionBarItemBlockName="create-skill-action-bar-item">
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
            pageSize={Number(pageSize)}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
