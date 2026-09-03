import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import {
  AssetGallery,
  AssetType,
} from "@/components/shared/assets/asset-gallery/asset-gallery";
import { assetListOutputSchema } from "@/lib/dto/asset";
import { SortDirection } from "@/lib/dto/common";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";

export const metadata = {
  title: "Dashboard - Assets",
  description: "Manage portfolio assets",
};

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    page: string;
    searchQuery: string;
    type: string;
    tag: string;
  }>;
}) {
  const {
    pageSize = 24,
    page = 1,
    searchQuery,
    type,
    tag,
  } = await searchParams;

  const find = wrapService({
    authenticatedOnly: true,
    handler: assetService.find,
  });

  const filter: Record<string, any> = {};

  if (searchQuery) {
    filter.name = {
      contains: searchQuery,
    };
  }

  if (type !== AssetType.all) {
    filter.type = {
      equals: type,
    };
  }

  const result = await find(
    {
      take: Number(pageSize),
      skip: (Number(page) - 1) * Number(pageSize),
      filter: filter,
      sort: { updatedAt: SortDirection.DESC },
      ...(tag ? { tag } : {}),
    },
    { tags: true },
  );

  const assets = validateOutput(result, assetListOutputSchema);

  return (
    <Page pageId="dashboard-assets">
      <PageTitle pageTitleBlockId="dashboard-assets-title">Asset</PageTitle>

      <PageLayout>
        <PageBlock id="asset-gallery" column="full">
          <AssetGallery
            initialAssets={assets.items}
            initialItemsCount={assets.itemsCount}
            multiSelect="auto"
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
