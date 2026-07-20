"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { Field } from "@/components/ui/field";
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
}

export function AssetField({ profileAssets }: AssetFieldProps) {
  const form = useFormContext();
  const assets = profileAssets?.map((pa) => pa.asset);
  return (
    <Field>
      <EntityAssets
        assets={assets}
        featuredAsset={undefined}
        compact={true}
        value={form.getValues()}
        onChange={(value) => {
          form.setValue("assetIds", value.assetIds ?? [], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </Field>
  );
}
