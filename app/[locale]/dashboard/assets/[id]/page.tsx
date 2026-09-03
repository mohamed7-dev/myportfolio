import { notFound } from "next/navigation";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type Asset, asset as assetSchema } from "@/lib/dto/asset";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";
import { AssetPreview } from "./_components/asset-preview";
import { DownloadButton } from "./_components/download-button";
import { NameField } from "./_components/name-field";
import { SubmitButton } from "./_components/submit-button";
import { TagsField } from "./_components/tags-field";
import { UpdateAssetForm } from "./_components/update-asset-form";

export const metadata = {
  title: "Dashboard - Edit Asset",
  description: "Edit a portfolio asset",
};

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const findOne = wrapService({
    authenticatedOnly: true,
    handler: assetService.findOne,
  });

  const result = await findOne({ id }, { tags: true });
  const asset = validateOutput(result, assetSchema);
  if (!asset) return notFound();

  return (
    <UpdateAssetForm asset={asset as unknown as Asset}>
      <Page pageId="dashboard-asset">
        <PageTitle pageTitleBlockId="dashboard-asset-title">Asset</PageTitle>
        <PageActionBar pageActionBarBlockId="dashboard-asset-action-bar">
          <PageActionBarItem actionBarItemBlockId="update-button">
            <SubmitButton />
          </PageActionBarItem>
          <PageActionBarItem actionBarItemBlockId="download-button">
            <DownloadButton asset={asset} />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock id="asset-preview" column="main">
            <AssetPreview asset={asset} />
          </PageBlock>
          <PageBlock id="asset-name" column="side">
            <NameField />
          </PageBlock>
          <PageBlock id="asset-id" column="side">
            <Field>
              <FieldLabel>Asset Id</FieldLabel>
              <Input readOnly defaultValue={asset.id} />
            </Field>
          </PageBlock>
          <PageBlock id="asset-source-identifier" column="side">
            <Field>
              <FieldLabel>Source identifier</FieldLabel>
              <Input readOnly defaultValue={asset.sourceIdentifier} />
            </Field>
          </PageBlock>
          <PageBlock id="asset-preview-identifier" column="side">
            <Field>
              <FieldLabel>Preview identifier</FieldLabel>
              <Input readOnly defaultValue={asset.previewIdentifier} />
            </Field>
          </PageBlock>
          <PageBlock id="asset-tags" column="side">
            <TagsField />
          </PageBlock>
        </PageLayout>
      </Page>
    </UpdateAssetForm>
  );
}
