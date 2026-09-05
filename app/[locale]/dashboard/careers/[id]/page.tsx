import { notFound } from "next/navigation";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { PendingSubmitButton } from "@/components/shared/pending-submit-button";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import { type Career, findOneCareerOutputSchema } from "@/lib/dto/career";
import { validateOutput } from "@/lib/helpers/validate-output";
import { careerService } from "@/services/domain/career.service";
import { CareerForm } from "./_components/career-form";
import { CareerFormAchievementsField } from "./_components/career-form-achievements-field";
import { CareerFormAssetField } from "./_components/career-form-asset-field";
import CareerFormDateFields from "./_components/career-form-date-fields";
import { CareerFormMainFields } from "./_components/career-form-main-fields";
import { CareerFormModeTypeFields } from "./_components/career-form-mode-type-fields";

export const metadata = {
  title: "Dashboard - Edit Career",
  description: "Edit a portfolio career entry",
};

export default async function CareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creatingNewEntity = id === NEW_ENTITY_PATH;

  let career: Career | undefined;

  if (!creatingNewEntity) {
    const findOne = wrapService({
      authenticatedOnly: true,
      handler: careerService.findOne.bind(careerService),
    });
    const result = await findOne({ id });
    career = validateOutput(result, findOneCareerOutputSchema);
  }

  if (!career && !creatingNewEntity) {
    notFound();
  }

  return (
    <CareerForm initialValues={career}>
      <Page pageId="dashboard-career">
        <PageTitle pageTitleBlockId="dashboard-career-title">
          {creatingNewEntity ? "New Career" : "Update Career"}
        </PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-career-action-bar">
          <PageActionBarItem actionBarItemBlockId="create-edit-career">
            <PendingSubmitButton
              formName="career-form"
              createEntityLabel="create career"
              updateEntityLabel="update career"
            />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="career-info">
            <CareerFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="career-assets">
            <CareerFormAssetField
              careerAssets={career?.assets ?? []}
              featuredAsset={career?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="career-mode">
            <CareerFormModeTypeFields />
          </PageBlock>
          <PageBlock column="side" id="career-dates">
            <CareerFormDateFields />
          </PageBlock>
          <PageBlock column="side" id="career-achievements">
            <CareerFormAchievementsField />
          </PageBlock>
        </PageLayout>
      </Page>
    </CareerForm>
  );
}
