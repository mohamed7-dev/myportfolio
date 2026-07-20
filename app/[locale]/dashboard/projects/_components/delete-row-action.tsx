import {
  ActionMenuItemWithConfirmation,
  type ActionMenuItemWithConfirmationProps,
} from "@/components/shared/action-menu-item-with-confirmation";

interface DeleteRowActionProps extends ActionMenuItemWithConfirmationProps {}

export function DeleteRowAction(props: DeleteRowActionProps) {
  return <ActionMenuItemWithConfirmation {...props} />;
}
