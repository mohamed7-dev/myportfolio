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
    pageSize?: string;
    skip?: string;
    school?: string;
    location?: string;
    degree?: string;
    startDate?: string;
    endDate?: string;
    isPresent?: string;
  }>;
}) {
  const {
    skip,
    pageSize,
    location,
    school,
    degree,
    startDate,
    endDate,
    isPresent,
  } = await searchParams;

  const find = wrapService({
    authenticatedOnly: true,
    handler: educationService.find,
  });

  const result = await find({
    take: Number(pageSize),
    skip: skip ? Number(skip) : undefined,
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
    <Page pageId="education">
      <PageTitle pageTitleBlockName="education-page-title">Education</PageTitle>
      <PageActionBar pageActionBarBlockName="education-page-action-bar">
        <PageActionBarItem actionBarItemBlockName="create-education-action-bar-item">
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
