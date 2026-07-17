import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { AssetGallery } from "@/components/shared/assets/asset-gallery/asset-gallery";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ pageSize: number }>;
}) {
  const { pageSize } = await searchParams;

  return (
    <Page pageId="assets">
      <PageTitle pageTitleBlockName="assets-page-title">Asset</PageTitle>

      <PageLayout>
        <PageBlock id="asset-gallery" column="full">
          <AssetGallery multiSelect="auto" pageSize={pageSize} />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
