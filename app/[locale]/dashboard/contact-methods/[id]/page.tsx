import { notFound } from "next/navigation";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type ContactMethod,
  findOneContactMethodOutputSchema,
} from "@/lib/dto/contact-method";
import { validateOutput } from "@/lib/helpers/validate-output";
import { contactMethodService } from "@/services/domain/contact-method.service";
import { ContactMethodForm } from "./_components/contact-method-form";
import { ContactMethodFormAssetField } from "./_components/contact-method-form-asset-field";
import { ContactMethodFormMainFields } from "./_components/contact-method-form-main-fields";
import { ContactMethodFormStatusField } from "./_components/contact-method-form-status-field";
import { ContactMethodFormSubmitButton } from "./_components/contact-method-form-submit-button";

export const metadata = {
  title: "Dashboard - Edit Contact Method",
  description: "Edit a portfolio contact method",
};

export default async function ContactMethodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creatingNewEntity = id === NEW_ENTITY_PATH;

  let contactMethod: ContactMethod | undefined;

  if (!creatingNewEntity) {
    const findOne = wrapService({
      authenticatedOnly: true,
      handler: contactMethodService.findOne.bind(contactMethodService),
    });
    const result = await findOne({ id });
    contactMethod = validateOutput(result, findOneContactMethodOutputSchema);
  }

  if (!contactMethod && !creatingNewEntity) {
    notFound();
  }

  return (
    <ContactMethodForm initialValues={contactMethod}>
      <Page pageId="dashboard-contact-method">
        <PageTitle pageTitleBlockId="dashboard-contact-method-title">
          {creatingNewEntity ? "New Contact Method" : "Update Contact Method"}
        </PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-contact-method-action-bar">
          <PageActionBarItem actionBarItemBlockId="dashboard-contact-method-submit-button">
            <ContactMethodFormSubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="main-fields">
            <ContactMethodFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="assets-field">
            <ContactMethodFormAssetField
              contactMethodAssets={contactMethod?.assets ?? []}
              featuredAsset={contactMethod?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="status-field">
            <ContactMethodFormStatusField />
          </PageBlock>
        </PageLayout>
      </Page>
    </ContactMethodForm>
  );
}
