"use client";

import { EllipsisVerticalIcon } from "lucide-react";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PageProvider } from "./page-provider";

interface PageProps extends React.ComponentProps<"div"> {
  entity?: any;
  pageId: string;
}

export function Page(props: PageProps) {
  const { children, entity, pageId, ...restProps } = props;
  const childrenArray = React.Children.toArray(children);
  const pageTitle = childrenArray.find((child) => isPageTitleItem(child));
  const pageDescription = childrenArray.find((child) =>
    isPageDescriptionItem(child),
  );
  const pageActionBar = childrenArray.find((child) => isPageActionBar(child));
  const pageContent = childrenArray.filter(
    (child) =>
      !isPageTitleItem(child) &&
      !isPageDescriptionItem(child) &&
      !isPageActionBar(child),
  );

  const pageHeader = (
    <header className="flex flex-col gap-4 bg-secondary-background px-3.5 py-4 rounded-base border-2 border-border shadow-default">
      <div className="min-w-0 flex items-center justify-between">
        {pageTitle ?? ""}
        {pageActionBar}
      </div>
      {pageDescription && <div className="shrink-0">{pageDescription}</div>}
    </header>
  );

  return (
    <PageProvider entity={entity} pageId={pageId}>
      <div className={cn("m-4", restProps.className)} {...restProps}>
        <div className="space-y-4">
          {pageHeader}
          {pageContent}
        </div>
      </div>
    </PageProvider>
  );
}

export function PageTitle({
  children,
}: {
  children: React.ReactNode;
  pageTitleBlockId: string;
}) {
  return <h1 className="text-2xl font-heading capitalize">{children}</h1>;
}

export function PageDescription({
  children,
}: {
  children: React.ReactNode;
  pageDescriptionBlockId: string;
}) {
  return <p className="text-sm text-foreground/80 font-base">{children}</p>;
}

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
      {menuItems.length > 0 && <PageActionBarDropdownMenu items={menuItems} />}
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

function isPageTitleItem(child: unknown) {
  return (
    React.isValidElement(child) &&
    "pageTitleBlockId" in
      (child as React.ReactElement<{ pageTitleBlockId: string }>).props
  );
}

function isPageDescriptionItem(child: unknown) {
  return (
    React.isValidElement(child) &&
    "pageDescriptionBlockId" in
      (child as React.ReactElement<{ pageDescriptionBlockId: string }>).props
  );
}

function isPageActionBar(child: unknown) {
  return (
    React.isValidElement(child) &&
    "pageActionBarBlockId" in
      (child as React.ReactElement<{ pageActionBarBlockId: string }>).props
  );
}
