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
import { educationListOutputSchema } from "@/lib/dto/education";
import { validateOutput } from "@/lib/helpers/validate-output";
import { educationService } from "@/services/domain/education.service";
import { EducationDataTable } from "./_components/education-data-table";

export default async function EducationListPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    page: string;
    school: string;
    location: string;
    degree: string;
    startDate: string;
    endDate: string;
    isPresent: string;
  }>;
}) {
  const {
    page = 1,
    pageSize = 24,
    location,
    school,
    degree,
    startDate,
    endDate,
    isPresent,
  } = await searchParams;

  const find = wrapService({
    authenticatedOnly: true,
    handler: educationService.find.bind(educationService),
  });

  const result = await find({
    take: Number(pageSize),
    skip: (Number(page) - 1) * Number(pageSize),
    filter: {
      ...(school && { school: { contains: school } }),
      ...(location && { location: { contains: location } }),
      ...(degree && { degree: { contains: degree } }),
      ...(startDate && { startDate: { equals: new Date(startDate) } }),
      ...(endDate && { endDate: { equals: new Date(endDate) } }),
      ...(isPresent !== undefined && {
        isPresent: { equals: Boolean(isPresent) },
      }),
    },
  });

  const education = validateOutput(result, educationListOutputSchema);

  return (
    <Page pageId="dashboard-education-list">
      <PageTitle pageTitleBlockId="dashboard-education-list-title">
        Education
      </PageTitle>
      <PageActionBar pageActionBarBlockId="dashboard-education-list-action-bar">
        <PageActionBarItem actionBarItemBlockId="add-new-education-entry">
          <Button>
            <Link href={"/dashboard/education/new"}>Add New Education</Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="full" id="education-list">
          <EducationDataTable
            education={education?.items}
            totalItemsCount={education.itemsCount}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
