/** biome-ignore-all lint/suspicious/noArrayIndexKey: no other unique identifier available when processing react children */
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
import { type PageContextProps, PageProvider, usePage } from "./page-provider";

interface PageProps extends React.ComponentProps<"div"> {
  entity?: any;
  pageId: string;
}

export function Page(props: PageProps) {
  const { children, entity, pageId, ...restProps } = props;
  const childrenArray = React.Children.toArray(children);
  const pageTitle = childrenArray.find((child) => isPageTitleItem(child));
  const pageActionBar = childrenArray.find((child) => isPageActionBar(child));
  const pageContent = childrenArray.filter(
    (child) => !isPageTitleItem(child) && !isPageActionBar(child),
  );

  const pageHeader = (
    <div className="flex items-center justify-between gap-2 bg-secondary-background px-3.5 py-4 rounded-base border-2 border-border shadow-default">
      <div className="min-w-0 shrink">{pageTitle ?? ""}</div>
      <div className="shrink-0">{pageActionBar}</div>
    </div>
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
  pageTitleBlockName: string;
}) {
  return <h1 className="text-2xl font-heading">{children}</h1>;
}

type InlineActionBarMenuItem = Omit<ActionBarMenuItem, "type" | "pageId">;
interface PageActionBarProps {
  children: React.ReactNode;
  menuItems?: InlineActionBarMenuItem[];
  pageActionBarBlockName: string;
}
export function PageActionBar({ children, menuItems }: PageActionBarProps) {
  const isMobile = useIsMobile();
  const pageContext = usePage("PageActionBar");
  const childArray = React.Children.toArray(children);
  const actionItems = childArray.filter((child) => isPageActionBarItem(child));
  const directChildren = childArray.filter(
    (child) => !isPageActionBarItem(child),
  );
  let actionsItemsToRender = actionItems;

  if (isMobile && actionItems.length > 1) {
    // on mobile screens, render only the last action item
    actionsItemsToRender = [actionItems[actionItems.length - 1]];
  }

  const actionBarMenuItems = menuItems?.map(
    (item) =>
      ({
        ...item,
        type: "dropdown",
        pageId: pageContext.pageId,
      }) satisfies ActionBarMenuItem,
  );

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
      {actionBarMenuItems && actionBarMenuItems.length > 0 && (
        <PageActionBarDropdownMenu
          items={actionBarMenuItems}
          pageContext={pageContext}
        />
      )}

      {/* // TODO: add entity info dropdown  */}
    </div>
  );
}

export interface ActionBarItemProps {
  children: React.ReactNode;
  actionBarItemBlockName: string;
}

export function PageActionBarItem({ children }: ActionBarItemProps) {
  return <>{children}</>;
}

export interface ActionBarMenuItem {
  pageId: string;
  component: React.FunctionComponent<{
    pageContext: PageContextProps;
  }>;
  type?: "button" | "dropdown";
  requiredPermissions?: string[];
  id?: string;
}

interface PageActionBarDropdownMenuProps {
  items: ActionBarMenuItem[];
  pageContext: PageContextProps;
}

function PageActionBarDropdownMenu({
  items,
  pageContext,
}: PageActionBarDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="noShadow" size="icon">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => (
          <item.component key={item.pageId + index} pageContext={pageContext} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// UTILS //

function isPageActionBarItem(child: unknown): boolean {
  return (
    React.isValidElement(child) &&
    "actionBarItemBlockName" in
      (child as React.ReactElement<{ actionBarItemBlockName: string }>).props
  );
}

function isPageTitleItem(child: unknown) {
  return (
    React.isValidElement(child) &&
    "pageTitleBlockName" in
      (child as React.ReactElement<{ pageTitleBlockName: string }>).props
  );
}

function isPageActionBar(child: unknown) {
  return (
    React.isValidElement(child) &&
    "pageActionBarBlockName" in
      (child as React.ReactElement<{ pageActionBarBlockName: string }>).props
  );
}
