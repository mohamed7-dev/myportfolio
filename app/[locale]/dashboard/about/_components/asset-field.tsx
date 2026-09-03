"use client";
import dynamic from "next/dynamic";
import { useFormContext, useWatch } from "react-hook-form";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import type { Asset } from "@/lib/dto/asset";
import {
  type ProfileAsset,
  ProfileAssetType,
  type UpdateProfileInputSchema,
} from "@/lib/dto/profile";
import { cn } from "@/lib/utils";

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
  const form = useFormContext<UpdateProfileInputSchema>();
  const assetIds = useWatch({ control: form.control, name: "assetIds" });
  const assets = profileAssets
    .sort((a, b) => a.position - b.position)
    ?.map((pa) => pa.asset);

  const setAssetType = (assetId: string, type: ProfileAssetType) => {
    form.setValue(
      "assetIds",
      (form.getValues("assetIds") ?? []).map((asset) =>
        asset.id === assetId ? { ...asset, type } : asset,
      ),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <Field>
      <EntityAssets
        assets={assets}
        featuredAsset={featuredAsset}
        compact={true}
        value={{
          assetIds: form.getValues("assetIds")?.map((v) => v.id),
          featuredAssetId: form.getValues("featuredAssetId"),
        }}
        actions={[
          {
            order: 50,
            component: ({ asset }) => (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Set type</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {Object.values(ProfileAssetType).map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setAssetType(asset.id, type)}
                      className={cn(
                        assetIds?.find((item) => item.id === asset.id)?.type ===
                          type && "border-2 border-border",
                      )}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ),
          },
        ]}
        onChange={(value) => {
          const currentAssets = form.getValues("assetIds") ?? [];
          const newAssets = (value.assetIds ?? []).map((id) => {
            const currentAsset = currentAssets.find((asset) => asset.id === id);

            return {
              id,
              type: currentAsset?.type,
            };
          });

          // A new asset has no type until the user selects one from its menu.
          form.setValue(
            "assetIds",
            newAssets as UpdateProfileInputSchema["assetIds"],
            { shouldDirty: true, shouldValidate: true },
          );
          form.setValue("featuredAssetId", value.featuredAssetId ?? undefined, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
      {assetIds?.some((asset) => !asset.type) && (
        <FieldError>Set a type for each asset.</FieldError>
      )}
    </Field>
  );
}
