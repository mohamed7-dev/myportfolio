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
import { type Skill, skill as skillSchema } from "@/lib/dto/skill";
import { validateOutput } from "@/lib/helpers/validate-output";
import { skillService } from "@/services/domain/skill.service";
import { SkillForm } from "./_components/skill-form";
import { SkillFormAssetField } from "./_components/skill-form-asset-field";
import { SkillFormCategoryField } from "./_components/skill-form-category-field";
import { SkillFormFeaturedField } from "./_components/skill-form-featured-field";
import { SkillFormMainFields } from "./_components/skill-form-main-fields";
import { SubmitButton } from "./_components/submit-button";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creatingNewEntity = id === NEW_ENTITY_PATH;

  let skill: Skill | undefined;
  if (!creatingNewEntity) {
    const findOne = wrapService({
      authenticatedOnly: true,
      handler: skillService.findOne,
    });
    const result = await findOne({ id });
    skill = validateOutput(result, skillSchema);
  }

  if (!skill && !creatingNewEntity) {
    notFound();
  }

  return (
    <SkillForm initialValues={skill}>
      <Page pageId="skill">
        <PageTitle pageTitleBlockName="skill-detail-page-title">
          {creatingNewEntity ? "New Skill" : "Update Skill"}
        </PageTitle>
        <PageActionBar pageActionBarBlockName="skill-page-action-bar">
          <PageActionBarItem actionBarItemBlockName="skill-page-action-bar-item">
            <SubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="skill-info">
            <SkillFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="skill-assets">
            <SkillFormAssetField
              skillAssets={skill?.assets ?? []}
              featuredAsset={skill?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="skill-featured">
            <SkillFormFeaturedField />
          </PageBlock>
          <PageBlock column="side" id="skill-category">
            <SkillFormCategoryField />
          </PageBlock>
        </PageLayout>
      </Page>
    </SkillForm>
  );
}
