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
import { careerListOutputSchema } from "@/lib/dto/career";
import { validateOutput } from "@/lib/helpers/validate-output";
import { careerService } from "@/services/domain/career.service";
import { CareerDataTable } from "./_components/careers-data-table";

export default async function CareersListPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize?: string;
    skip?: string;
    name?: string;
    location?: string;
    organization?: string;
    startDate?: string;
    endDate?: string;
    isPresent?: string;
  }>;
}) {
  const {
    skip,
    pageSize,
    location,
    organization,
    name,
    startDate,
    endDate,
    isPresent,
  } = await searchParams;

  const find = wrapService({
    authenticatedOnly: true,
    handler: careerService.find,
  });

  const result = await find({
    take: Number(pageSize),
    skip: skip ? Number(skip) : undefined,
    filter: {
      ...(name && { name: { contains: name } }),
      ...(location && { location: { contains: location } }),
      ...(organization && { organization: { contains: organization } }),
      ...(startDate && { startDate: { equals: new Date(startDate) } }),
      ...(endDate && { endDate: { equals: new Date(endDate) } }),
      ...(isPresent !== undefined && {
        isPresent: { equals: Boolean(isPresent) },
      }),
    },
  });

  const careers = validateOutput(result, careerListOutputSchema);

  return (
    <Page pageId="careers">
      <PageTitle pageTitleBlockName="careers-page-title">Careers</PageTitle>
      <PageActionBar pageActionBarBlockName="careers-page-action-bar">
        <PageActionBarItem actionBarItemBlockName="create-career-action-bar-item">
          <Button>
            <Link href={"/dashboard/careers/new"}>Add New Career</Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="full" id="career-list">
          <CareerDataTable
            careers={careers?.items}
            totalItemsCount={careers.itemsCount}
            pageSize={Number(pageSize)}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
