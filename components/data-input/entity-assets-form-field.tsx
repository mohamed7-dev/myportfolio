"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import type { Asset, EntityAsset } from "@/lib/dto/asset";
import { notNullOrUndefined } from "@/lib/utils/not-null-or-undefined";
import { DynamicLoader } from "../shared/dynamic-loader";
import { Field, FieldError } from "../ui/field";

const EntityAssets = dynamic(
  () =>
    import("@/components/shared/entity-assets/entity-assets").then(
      (mod) => mod.EntityAssets,
    ),
  { ssr: false, loading: () => <DynamicLoader /> },
);

export function EntityAssetsFormField({
  entityAssets,
  featuredAsset,
}: {
  entityAssets: EntityAsset[];
  featuredAsset?: Asset;
}) {
  const form = useFormContext();
  const assets = entityAssets
    .sort((a, b) => a.position - b.position)
    ?.map((pa) => pa.asset);

  const errors = [
    form.formState.errors?.assetIds?.message,
    form.formState.errors?.featuredAssetId?.message,
  ].filter(notNullOrUndefined);

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
      {!!errors.length && (
        <FieldError errors={errors.map((e) => ({ message: e as string }))} />
      )}
    </Field>
  );
}
