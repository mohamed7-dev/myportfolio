import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { type ClientSafeProfile, clientSafeSchema } from "@/lib/dto/profile";
import { InternalServerError } from "@/lib/errors/errors";
import { validateOutput } from "@/lib/helpers/validate-output";
import { authService } from "@/services/domain/auth.service";
import { AboutForm } from "./_components/about-form";
import { AssetField } from "./_components/asset-field";
import { MainFields } from "./_components/main-fields";
import { SubmitButton } from "./_components/submit-button";

export default async function AboutPage() {
  const me = wrapService({
    authenticatedOnly: true,
    handler: authService.me,
  });

  const result = await me();

  let profile: ClientSafeProfile | undefined;
  if (result) {
    profile = validateOutput(result, clientSafeSchema);
  }
  if (!profile) {
    throw new InternalServerError("Missing default profile");
  }
  return (
    <AboutForm initialValues={profile}>
      <Page pageId="about-me">
        <PageTitle pageTitleBlockName="about-me-page-title">About Me</PageTitle>
        <PageActionBar pageActionBarBlockName="about-me-page-action-bar">
          <PageActionBarItem actionBarItemBlockName="about-me-page-action-bar-item">
            <SubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="profile-info">
            <MainFields />
          </PageBlock>
          <PageBlock column="side" id="project-assets">
            <AssetField
              profileAssets={profile.assets ?? []}
              featuredAsset={profile.featuredAsset ?? undefined}
            />
          </PageBlock>
        </PageLayout>
      </Page>
    </AboutForm>
  );
}
