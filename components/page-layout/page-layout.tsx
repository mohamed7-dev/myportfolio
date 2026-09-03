import React from "react";
import type { PageBlockProps } from "./page-block";

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
  fullWidthFirst?: boolean;
};

export function PageLayout({
  children,
  className,
  fullWidthFirst = true,
}: PageLayoutProps) {
  // Normalize and extract PageBlock children
  const blocks: React.ReactElement<PageBlockProps>[] = [];

  React.Children.forEach(children, (child) => {
    // Direct PageBlock
    if (isPageBlock(child)) {
      blocks.push(child);
    }

    // Fragment support
    if (React.isValidElement(child) && child.type === React.Fragment) {
      React.Children.forEach(
        (child as React.ReactElement<any>).props.children,
        (fragmentChild) => {
          if (isPageBlock(fragmentChild)) {
            blocks.push(fragmentChild);
          }
        },
      );
    }
  });

  // Group blocks by column
  const fullWidthBlocks = blocks.filter(
    (block) => block.props.column === "full",
  );

  const mainBlocks = blocks.filter((block) => block.props.column === "main");

  const sideBlocks = blocks.filter((block) => block.props.column === "side");

  return (
    <div
      className={["grid grid-cols-1 gap-4 lg:grid-cols-5", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Full width at the top */}
      {fullWidthFirst && fullWidthBlocks.length > 0 && (
        <div className="col-span-1 space-y-4 lg:col-span-5">
          {fullWidthBlocks}
        </div>
      )}

      {/* Main */}
      <div className="col-span-1 space-y-4 lg:col-span-3">{mainBlocks}</div>

      {/* Sidebar */}
      <div className="col-span-1 space-y-4 lg:col-span-2">{sideBlocks}</div>

      {/* Full width at the top */}
      {!fullWidthFirst && fullWidthBlocks.length > 0 && (
        <div className="col-span-1 space-y-4 lg:col-span-5">
          {fullWidthBlocks}
        </div>
      )}
    </div>
  );
}

function isPageBlock(
  child: unknown,
): child is React.ReactElement<PageBlockProps> {
  return (
    React.isValidElement(child) &&
    "column" in (child as React.ReactElement<PageBlockProps>).props &&
    "id" in (child as React.ReactElement<PageBlockProps>).props
  );
}
