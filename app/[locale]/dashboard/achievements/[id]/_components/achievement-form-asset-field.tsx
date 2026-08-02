"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { Field } from "@/components/ui/field";
import type { AchievementAsset } from "@/lib/dto/achievement";
import type { Asset } from "@/lib/dto/asset";

const EntityAssets = dynamic(
  () =>
    import("@/components/shared/entity-assets/entity-assets").then(
      (mod) => mod.EntityAssets,
    ),
  { ssr: false, loading: () => <DynamicLoader /> },
);

interface AchievementFormAssetFieldProps {
  achievementAssets: AchievementAsset[];
  featuredAsset?: Asset;
}

export function AchievementFormAssetField({
  achievementAssets,
  featuredAsset,
}: AchievementFormAssetFieldProps) {
  const form = useFormContext();
  const assets = achievementAssets?.map((pa) => pa.asset);
  return (
    <Field>
      <EntityAssets
        assets={assets}
        featuredAsset={featuredAsset}
        compact={true}
        value={form.getValues()}
        onChange={(value) => {
          form.setValue("featuredAssetId", value.featuredAssetId ?? undefined, {
            shouldDirty: true,
            shouldValidate: true,
          });
          form.setValue("assetIds", value.assetIds ?? [], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </Field>
  );
}
