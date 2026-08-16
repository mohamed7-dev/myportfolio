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
  type Achievement,
  findOneAchievementOutputSchema,
} from "@/lib/dto/achievement";
import { validateOutput } from "@/lib/helpers/validate-output";
import { achievementService } from "@/services/domain/achievement.service";
import { AchievementForm } from "./_components/achievement-form";
import { AchievementFormAssetField } from "./_components/achievement-form-asset-field";
import AchievementFormDateField from "./_components/achievement-form-date-field";
import { AchievementFormMainFields } from "./_components/achievement-form-main-fields";
import { AchievementFormSubmitButton } from "./_components/achievement-form-submit-button";
import { AchievementFormTypeField } from "./_components/achievement-form-type-field";

export default async function AchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creatingNewEntity = id === NEW_ENTITY_PATH;

  let achievement: Achievement | undefined;

  if (!creatingNewEntity) {
    const findOne = wrapService({
      authenticatedOnly: true,
      handler: achievementService.findOne.bind(achievementService),
    });
    const result = await findOne({ id });
    achievement = validateOutput(result, findOneAchievementOutputSchema);
  }

  if (!achievement && !creatingNewEntity) {
    notFound();
  }

  return (
    <AchievementForm initialValues={achievement}>
      <Page pageId="dashboard-achievement">
        <PageTitle pageTitleBlockId="dashboard-achievement-title">
          {creatingNewEntity ? "New Achievement" : "Update Achievement"}
        </PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-achievement-action-bar">
          <PageActionBarItem actionBarItemBlockId="create-edit-achievement">
            <AchievementFormSubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="achievement-main-fields">
            <AchievementFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="achievement-asset-field">
            <AchievementFormAssetField
              achievementAssets={achievement?.assets ?? []}
              featuredAsset={achievement?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="achievement-type-field">
            <AchievementFormTypeField />
          </PageBlock>
          <PageBlock column="side" id="achievement-date-field">
            <AchievementFormDateField />
          </PageBlock>
        </PageLayout>
      </Page>
    </AchievementForm>
  );
}
