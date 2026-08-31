import React from "react";
import { cn } from "@/lib/utils";

interface PageProps extends React.ComponentProps<"div"> {
  pageId: string;
}

export function Page(props: PageProps) {
  const { children, pageId, ...restProps } = props;
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
    <div className={cn("m-4", restProps.className)} {...restProps}>
      <div className="space-y-4">
        {pageHeader}
        {pageContent}
      </div>
    </div>
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

// UTILS //

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
