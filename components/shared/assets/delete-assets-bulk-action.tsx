import { useMutation } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { ActionMenuItemWithConfirmation } from "@/components/shared/action-menu-item-with-confirmation";
import type { Asset, DeleteAssetsOutputSchema } from "@/lib/dto/asset";

type AssetsInput = Array<Pick<Asset, "id">>;

export function DeleteAssetsBulkAction({
  selection,
  refetch,
}: {
  selection: AssetsInput;
  refetch: () => void;
}) {
  const selectionLength = selection.length;
  const { mutate } = useMutation({
    mutationFn: async (input: { input: { ids: string[] } }) => {
      const res = await fetch("/api/assets", {
        method: "delete",
        body: JSON.stringify(input),
        credentials: "include",
      });
      const data = (await res.json()) as DeleteAssetsOutputSchema;
      return data;
    },
    onSuccess: (result: DeleteAssetsOutputSchema) => {
      if (result[0].result === "DELETED") {
        toast.success(`Deleted ${selectionLength} assets`);
      } else {
        const message = result[0].message;
        toast.error(`Failed to delete assets: ${message}`);
      }
      refetch();
    },
    onError: () => {
      toast.error(`Failed to delete ${selectionLength} assets`);
    },
  });

  return (
    <ActionMenuItemWithConfirmation
      onExecute={() =>
        mutate({
          input: {
            ids: selection.map((s) => s.id),
          },
        })
      }
      label="Delete"
      confirm={`Are you sure you want to delete ${selectionLength} assets?`}
      icon={TrashIcon}
      keepMenuOpen={false}
    />
  );
}
