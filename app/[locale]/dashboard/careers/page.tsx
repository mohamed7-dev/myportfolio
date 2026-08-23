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

export const metadata = {
  title: "Dashboard - Careers",
  description: "Manage portfolio career entries",
};

export default async function CareersListPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    page: string;
    name: string;
    location: string;
    organization: string;
    startDate: string;
    endDate: string;
    isPresent: string;
  }>;
}) {
  const {
    page = 1,
    pageSize = 24,
    location,
    organization,
    name,
    startDate,
    endDate,
    isPresent,
  } = await searchParams;

  const find = wrapService({
    authenticatedOnly: true,
    handler: careerService.find.bind(careerService),
  });

  const result = await find({
    take: Number(pageSize),
    skip: (Number(page) - 1) * Number(pageSize),
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
    <Page pageId="dashboard-careers">
      <PageTitle pageTitleBlockId="dashboard-careers-title">Careers</PageTitle>
      <PageActionBar pageActionBarBlockId="dashboard-careers-action-bar">
        <PageActionBarItem actionBarItemBlockId="add-new-career">
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
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
