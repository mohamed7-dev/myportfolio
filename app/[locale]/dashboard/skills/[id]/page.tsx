import { notFound } from "next/navigation";
import { wrapService } from "@/api/common/create-router";
import { EntityAssetsFormField } from "@/components/data-input/entity-assets-form-field";
import { Page, PageTitle } from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { PendingSubmitButton } from "@/components/shared/pending-submit-button";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import { type Skill, skill as skillSchema } from "@/lib/dto/skill";
import { validateOutput } from "@/lib/helpers/validate-output";
import { skillService } from "@/services/domain/skill.service";
import { SkillForm } from "./_components/skill-form";
import { SkillFormCategoryField } from "./_components/skill-form-category-field";
import { SkillFormMainFields } from "./_components/skill-form-main-fields";
import { SkillFormStatusField } from "./_components/skill-form-status-field";

export const metadata = {
  title: "Dashboard - Edit Skill",
  description: "Edit a portfolio skill",
};

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
      handler: skillService.findOne.bind(skillService),
    });
    const result = await findOne({ id });
    skill = validateOutput(result, skillSchema);
  }

  if (!skill && !creatingNewEntity) {
    notFound();
  }

  return (
    <SkillForm initialValues={skill}>
      <Page pageId="dashboard-skill">
        <PageTitle pageTitleBlockId="dashboard-skill-title">
          {creatingNewEntity ? "New Skill" : "Update Skill"}
        </PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-skill-action-bar">
          <PageActionBarItem actionBarItemBlockId="create-edit-skill">
            <PendingSubmitButton
              formName="skill-form"
              createEntityLabel="Create skill"
              updateEntityLabel="Update skill"
            />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="skill-info">
            <SkillFormMainFields />
          </PageBlock>
          <PageBlock column="side" id="skill-assets">
            <EntityAssetsFormField
              entityAssets={skill?.assets ?? []}
              featuredAsset={skill?.featuredAsset ?? undefined}
            />
          </PageBlock>
          <PageBlock column="side" id="skill-featured">
            <SkillFormStatusField />
          </PageBlock>
          <PageBlock column="side" id="skill-category">
            <SkillFormCategoryField />
          </PageBlock>
        </PageLayout>
      </Page>
    </SkillForm>
  );
}
