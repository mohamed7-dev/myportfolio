"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { Field } from "@/components/ui/field";
import type { Asset } from "@/lib/dto/asset";
import type { ProfileAsset } from "@/lib/dto/profile";

const EntityAssets = dynamic(
  () =>
    import("@/components/shared/entity-assets/entity-assets").then(
      (mod) => mod.EntityAssets,
    ),
  { ssr: false, loading: () => <DynamicLoader /> },
);

interface AssetFieldProps {
  profileAssets: ProfileAsset[];
  featuredAsset?: Asset;
}

export function AssetField({ profileAssets, featuredAsset }: AssetFieldProps) {
  const form = useFormContext();
  const assets = profileAssets?.map((pa) => pa.asset);
  return (
    <Field>
      <EntityAssets
        assets={assets}
        featuredAsset={featuredAsset}
        compact={true}
        value={form.getValues()}
        onChange={(value) => {
          form.setValue("assetIds", value.assetIds ?? [], {
            shouldDirty: true,
            shouldValidate: true,
          });
          form.setValue("featuredAssetId", value.featuredAssetId ?? undefined, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </Field>
  );
}
