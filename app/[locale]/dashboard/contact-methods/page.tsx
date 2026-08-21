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
import { contactMethodListOutputSchema } from "@/lib/dto/contact-method";
import { validateOutput } from "@/lib/helpers/validate-output";
import { contactMethodService } from "@/services/domain/contact-method.service";
import { ContactMethodDataTable } from "./_components/contact-method-data-table";

export default async function ContactMethodListPage({
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
    handler: contactMethodService.find.bind(contactMethodService),
  });

  const result = await find({
    take: Number(pageSize),
    skip: (Number(page) - 1) * Number(pageSize),
    filter: {
      ...(name && { name: { contains: name } }),
    },
  });

  const contactMethods = validateOutput(result, contactMethodListOutputSchema);

  return (
    <Page pageId="dashboard-contact-method-list">
      <PageTitle pageTitleBlockId="dashboard-contact-method-list-title">
        Contact Methods
      </PageTitle>
      <PageActionBar pageActionBarBlockId="dashboard-contact-method-list-action-bar">
        <PageActionBarItem actionBarItemBlockId="new-edit-contact-method">
          <Button>
            <Link href={"/dashboard/contact-methods/new"}>
              Add New Contact Method
            </Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="full" id="contact-method-list">
          <ContactMethodDataTable
            contactMethods={contactMethods?.items}
            totalItemsCount={contactMethods.itemsCount}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
