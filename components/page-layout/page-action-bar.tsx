"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface PageActionBarProps {
  children: React.ReactNode;
  pageActionBarBlockId: string;
}
export function PageActionBar({ children }: PageActionBarProps) {
  const isMobile = useIsMobile();
  const childArray = React.Children.toArray(children);
  const actionItems = childArray.filter((child) => isPageActionBarItem(child));
  const menuItems = childArray.filter((child) =>
    isPageActionBarMenuItem(child),
  );
  const directChildren = childArray.filter(
    (child) => !isPageActionBarItem(child) && !isPageActionBarMenuItem(child),
  );
  let actionsItemsToRender = actionItems;

  if (isMobile && actionItems.length > 1) {
    // on mobile screens, render only the last action item
    actionsItemsToRender = [actionItems[actionItems.length - 1]];
  }

  return (
    <div className="flex justify-end gap-2">
      {/* Hide direct children on mobile */}
      {!isMobile &&
        directChildren.map((child, index) => (
          <React.Fragment key={index}>{child}</React.Fragment>
        ))}

      {/* Render action items */}
      {actionsItemsToRender.map((item, index) =>
        React.cloneElement(item as React.ReactElement<ActionBarItemProps>, {
          key: `action-${index}`,
        }),
      )}

      {/* Dropdown menu */}
      {menuItems.length > 0 && isMobile && (
        <PageActionBarDropdownMenu items={menuItems} />
      )}
    </div>
  );
}

export interface ActionBarItemProps {
  children: React.ReactNode;
  actionBarItemBlockId: string;
}

export function PageActionBarItem({ children }: ActionBarItemProps) {
  return <>{children}</>;
}

export interface PageActionBarMenuItemProps {
  children: React.ReactNode;
  pageActionBarMenuItemBlockId: string;
}

export function PageActionBarMenuItem({
  children,
}: PageActionBarMenuItemProps) {
  return <>{children}</>;
}

interface PageActionBarDropdownMenuProps {
  items: React.ReactNode[];
}

function PageActionBarDropdownMenu({ items }: PageActionBarDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="noShadow" size="icon">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => (
          <React.Fragment key={`menu-item-${index}`}>{item}</React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// UTILS //

function isPageActionBarItem(child: unknown): boolean {
  return (
    React.isValidElement(child) &&
    "actionBarItemBlockId" in
      (child as React.ReactElement<{ actionBarItemBlockId: string }>).props
  );
}

function isPageActionBarMenuItem(child: unknown): boolean {
  return (
    React.isValidElement(child) &&
    "pageActionBarMenuItemBlockId" in
      (
        child as React.ReactElement<{
          pageActionBarMenuItemBlockId: string;
        }>
      ).props
  );
}
