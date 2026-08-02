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
    pageSize?: string;
    skip?: string;
    name?: string;
  }>;
}) {
  const { skip, pageSize, name } = await searchParams;

  const find = wrapService({
    authenticatedOnly: true,
    handler: contactMethodService.find,
  });

  const result = await find({
    take: Number(pageSize),
    skip: skip ? Number(skip) : undefined,
    filter: {
      ...(name && { name: { contains: name } }),
    },
  });

  const contactMethods = validateOutput(result, contactMethodListOutputSchema);

  return (
    <Page pageId="contact-method-list-page">
      <PageTitle pageTitleBlockName="contact-method-list-page-title">
        Contact Methods
      </PageTitle>
      <PageActionBar pageActionBarBlockName="contact-method-list-page-action-bar">
        <PageActionBarItem actionBarItemBlockName="new-contact-method-action-bar-item">
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
            pageSize={Number(pageSize)}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
