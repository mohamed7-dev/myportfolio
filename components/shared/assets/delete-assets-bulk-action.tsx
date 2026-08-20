import { useMutation } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { ActionMenuItemWithConfirmation } from "@/components/shared/action-menu-item-with-confirmation";
import type {
  Asset,
  DeleteAssetsInputSchema,
  DeleteAssetsOutputSchema,
} from "@/lib/dto/asset";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { apiRoutes } from "@/lib/helpers/router";

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
    mutationFn: async (input: DeleteAssetsInputSchema) => {
      const res = await api(apiRoutes.assets.delete, input, true);
      const data = (await res.json()) as DeleteAssetsOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: (result) => {
      if (result[0].result === "DELETED") {
        toast.success(`Deleted ${selectionLength} assets`);
      } else {
        const message = result[0].message;
        toast.error(`Failed to delete assets: ${message}`);
      }
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <ActionMenuItemWithConfirmation
      onExecute={() =>
        mutate({
          ids: selection.map((s) => s.id),
        })
      }
      content={
        <>
          <TrashIcon />
          Delete
        </>
      }
      confirm={`Are you sure you want to delete ${selectionLength} assets?`}
      keepMenuOpen={false}
    />
  );
}
