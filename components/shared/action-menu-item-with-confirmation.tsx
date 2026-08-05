import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export interface ActionMenuItemWithConfirmationProps {
  content: React.ReactNode;
  confirm?: React.ReactNode;
  disabled?: boolean;
  keepMenuOpen?: boolean;
  onExecute(): void;
}

export function ActionMenuItemWithConfirmation(
  props: ActionMenuItemWithConfirmationProps,
) {
  const [confirming, setConfirming] = React.useState(false);

  const execute = () => {
    if (props.disabled) {
      return;
    }

    if (props.confirm) {
      setConfirming(true);
      return;
    }

    props.onExecute();
  };

  return (
    <>
      <ActionMenuItem {...props} disabled={props.disabled} onSelect={execute} />

      <ConfirmationDialog
        open={confirming}
        description={props.confirm}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          props.onExecute();
        }}
      />
    </>
  );
}

interface MenuItemProps
  extends Pick<
    ActionMenuItemWithConfirmationProps,
    "content" | "disabled" | "keepMenuOpen"
  > {
  onSelect: () => void;
}

function ActionMenuItem({ content, disabled, onSelect }: MenuItemProps) {
  return (
    <DropdownMenuItem
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect();
      }}
    >
      {content}
    </DropdownMenuItem>
  );
}

interface ConfirmationDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
  description: React.ReactNode;
  open: boolean;
}

function ConfirmationDialog({
  open,
  description,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!description) {
    return null;
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
