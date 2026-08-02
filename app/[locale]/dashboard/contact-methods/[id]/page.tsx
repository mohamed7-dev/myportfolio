import { notFound } from "next/navigation";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageTitle,
} from "@/components/page-layout/page";
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
import { ContactMethodFormSubmitButton } from "./_components/contact-method-form-submit-button";

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
      handler: contactMethodService.findOne,
    });
    const result = await findOne({ id });
    contactMethod = validateOutput(result, findOneContactMethodOutputSchema);
  }

  if (!contactMethod && !creatingNewEntity) {
    notFound();
  }

  return (
    <ContactMethodForm initialValues={contactMethod}>
      <Page pageId="contact-method-detail-page">
        <PageTitle pageTitleBlockName="contact-method-detail-page-title">
          {creatingNewEntity ? "New Contact Method" : "Update Contact Method"}
        </PageTitle>
        <PageActionBar pageActionBarBlockName="contact-method-detail-page-action-bar">
          <PageActionBarItem actionBarItemBlockName="contact-method-detail-page-submit-button">
            <ContactMethodFormSubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="contact-method-detail-main-fields">
            <ContactMethodFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="contact-method-detail-assets">
            <ContactMethodFormAssetField
              contactMethodAssets={contactMethod?.assets ?? []}
              featuredAsset={contactMethod?.featuredAsset ?? undefined}
            />
          </PageBlock>
        </PageLayout>
      </Page>
    </ContactMethodForm>
  );
}
