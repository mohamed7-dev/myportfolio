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
import { achievementListOutputSchema } from "@/lib/dto/achievement";
import { type Career, findOneCareerOutputSchema } from "@/lib/dto/career";
import { validateOutput } from "@/lib/helpers/validate-output";
import { achievementService } from "@/services/domain/achievement.service";
import { careerService } from "@/services/domain/career.service";
import { CareerForm } from "./_components/career-form";
import { CareerFormAchievementsField } from "./_components/career-form-achievements-field";
import { CareerFormAssetField } from "./_components/career-form-asset-field";
import CareerFormDateFields from "./_components/career-form-date-fields";
import { CareerFormMainFields } from "./_components/career-form-main-fields";
import { CareerFormModeTypeFields } from "./_components/career-form-mode-type-fields";
import { CareerFormSubmitButton } from "./_components/career-form-submit-button";

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

  const findAchievements = wrapService({
    authenticatedOnly: true,
    handler: achievementService.find.bind(achievementService),
  });
  const achievementsResult = await findAchievements({});
  const achievements = validateOutput(
    achievementsResult,
    achievementListOutputSchema,
  );

  return (
    <CareerForm initialValues={career}>
      <Page pageId="dashboard-career">
        <PageTitle pageTitleBlockId="dashboard-career-title">
          {creatingNewEntity ? "New Career" : "Update Career"}
        </PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-career-action-bar">
          <PageActionBarItem actionBarItemBlockId="create-edit-career">
            <CareerFormSubmitButton />
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
            <CareerFormAchievementsField achievements={achievements.items} />
          </PageBlock>
        </PageLayout>
      </Page>
    </CareerForm>
  );
}
