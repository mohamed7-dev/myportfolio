"use client";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { PageBlockProps } from "./page-block";

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
  alternate?: boolean;
};

export function PageLayout({
  children,
  className,
  alternate = false,
}: PageLayoutProps) {
  const isMobile = useIsMobile();

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

  // Pair main + side blocks into rows.
  const rowCount = Math.max(mainBlocks.length, sideBlocks.length);

  const rows = Array.from({ length: rowCount }, (_, index) => ({
    main: mainBlocks[index],
    side: sideBlocks[index],
  }));

  return (
    <div className={className}>
      {isMobile ? (
        // Mobile: preserve the original markup order.
        <div className="space-y-4">{blocks}</div>
      ) : (
        <div className="space-y-4">
          {/* Full width sections */}
          {fullWidthBlocks.length > 0 && (
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-5 space-y-4">{fullWidthBlocks}</div>
            </div>
          )}

          {/* Main + side rows */}
          {rows.map((row, index) => {
            const shouldSwap = alternate && index % 2 === 1;

            const main = row.main;
            const side = row.side;

            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: no other key available
              <div key={index} className="grid grid-cols-5 gap-4">
                {shouldSwap ? (
                  <>
                    {side && <div className="col-span-2">{side}</div>}

                    {main && <div className="col-span-3">{main}</div>}
                  </>
                ) : (
                  <>
                    {main && <div className="col-span-3">{main}</div>}

                    {side && <div className="col-span-2">{side}</div>}
                  </>
                )}
              </div>
            );
          })}
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
