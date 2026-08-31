import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { type ClientSafeProfile, clientSafeSchema } from "@/lib/dto/profile";
import { InternalServerError } from "@/lib/errors/errors";
import { validateOutput } from "@/lib/helpers/validate-output";
import { authService } from "@/services/domain/auth.service";
import { AboutForm } from "./_components/about-form";
import { AssetField } from "./_components/asset-field";
import { CvAssetIdField } from "./_components/cv-field";
import { MainFields } from "./_components/main-fields";
import { SubmitButton } from "./_components/submit-button";

export const metadata = {
  title: "Dashboard - About Me",
  description: "Manage portfolio profile information",
};

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
      <Page pageId="dashboard-about">
        <PageTitle pageTitleBlockId="dashboard-about-title">About Me</PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-about-action-bar">
          <PageActionBarItem actionBarItemBlockId="submit-button">
            <SubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock column="main" id="info">
            <MainFields />
          </PageBlock>
          <PageBlock column="side" id="cv-source-identifier">
            <CvAssetIdField />
          </PageBlock>
          <PageBlock column="side" id="assets">
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
