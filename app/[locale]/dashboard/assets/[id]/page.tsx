import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { type Asset, asset as assetSchema } from "@/lib/dto/asset";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/asset.service";
import { NameField } from "./_components/name-field";
import { SubmitButton } from "./_components/submit-button";
import { UpdateAssetForm } from "./_components/update-asset-form";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await assetService().asset(id);
  const asset = validateOutput(result, assetSchema);

  if (!asset) return notFound();

  return (
    <UpdateAssetForm asset={asset as unknown as Asset}>
      <Page pageId="asset-detail-page">
        <PageTitle pageTitleBlockName="asset-detail-page-title">
          Asset
        </PageTitle>
        <PageActionBar pageActionBarBlockName="asset-detail-page-action-bar">
          <PageActionBarItem actionBarItemBlockName="update-button">
            <SubmitButton />
          </PageActionBarItem>
        </PageActionBar>
        <PageLayout>
          <PageBlock id="asset-preview" column="main">
            <div className="relative flex items-center justify-center bg-secondary-background/50 rounded-lg min-h-75 overflow-auto resize-y">
              <Image
                src={asset.sourceIdentifier}
                alt={asset.name}
                width={500}
                height={500}
                loading="eager"
                className="max-w-full object-contain"
              />
            </div>
          </PageBlock>
          <PageBlock id="asset-name" column="side">
            <NameField />
          </PageBlock>
          <PageBlock id="asset-tags" column="side">
            <p>Tags</p>
          </PageBlock>
        </PageLayout>
      </Page>
    </UpdateAssetForm>
  );
}
