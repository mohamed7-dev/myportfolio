"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { Field } from "@/components/ui/field";
import type { Asset } from "@/lib/dto/asset";
import type { SkillAsset } from "@/lib/dto/skill";

const EntityAssets = dynamic(
  () =>
    import("@/components/shared/entity-assets/entity-assets").then(
      (mod) => mod.EntityAssets,
    ),
  { ssr: false, loading: () => <DynamicLoader /> },
);

interface SkillFormFormAssetFieldProps {
  skillAssets: SkillAsset[];
  featuredAsset?: Asset;
}

export function SkillFormAssetField({
  skillAssets,
  featuredAsset,
}: SkillFormFormAssetFieldProps) {
  const form = useFormContext();
  const assets = skillAssets?.map((pa) => pa.asset);
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
