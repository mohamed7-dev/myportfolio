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
  type Education,
  findOneEducationOutputSchema,
} from "@/lib/dto/education";
import { validateOutput } from "@/lib/helpers/validate-output";
import { educationService } from "@/services/domain/education.service";
import { EducationForm } from "./_components/education-form";
import { EducationFormAssetField } from "./_components/education-form-asset-field";
import EducationFormDateFields from "./_components/education-form-date-fields";
import { EducationFormMainFields } from "./_components/education-form-main-fields";
import { EducationFormSubmitButton } from "./_components/education-form-submit-button";

export const metadata = {
  title: "Dashboard - Edit Education",
  description: "Edit a portfolio education entry",
};

export default async function EducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creatingNewEntity = id === NEW_ENTITY_PATH;

  let education: Education | undefined;

  if (!creatingNewEntity) {
    const findOne = wrapService({
      authenticatedOnly: true,
      handler: educationService.findOne.bind(educationService),
    });
    const result = await findOne({ id });
    education = validateOutput(result, findOneEducationOutputSchema);
  }

  if (!education && !creatingNewEntity) {
    notFound();
  }

  return (
    <EducationForm initialValues={education}>
      <Page pageId="dashboard-education-entry">
        <PageTitle pageTitleBlockId="dashboard-education-entry-title">
          {creatingNewEntity ? "New Education Item" : "Update Education Item"}
        </PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-education-entry-action-bar">
          <PageActionBarItem actionBarItemBlockId="create-edit-education-entry">
            <EducationFormSubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="main-fields">
            <EducationFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="assets">
            <EducationFormAssetField
              educationItemAssets={education?.assets ?? []}
              featuredAsset={education?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="dates">
            <EducationFormDateFields />
          </PageBlock>
        </PageLayout>
      </Page>
    </EducationForm>
  );
}
