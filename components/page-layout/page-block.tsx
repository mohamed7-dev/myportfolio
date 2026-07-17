"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PageBlockProvider } from "./page-block-provider";

export interface PageBlockProps {
  id: string;
  column: "side" | "main" | "full";
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
  className?: string;
  unStyled?: boolean;
}

export function PageBlock(props: PageBlockProps) {
  const {
    id,
    title,
    description,
    column,
    className,
    children,
    unStyled = false,
  } = props;
  const contextValue = React.useMemo(
    () => ({
      id,
      title,
      description,
      column,
    }),
    [id, title, description, column],
  );

  return (
    <PageBlockProvider {...contextValue}>
      {unStyled && (
        <div
          className={cn(
            "@container  w-full",
            className,
            "animate-in fade-in duration-300",
          )}
        >
          {/* {title || description ? (
						<div>
							{title && <CardTitle>{title}</CardTitle>}
							{description && <CardDescription>{description}</CardDescription>}
						</div>
					) : null} */}
          {children}
        </div>
      )}
      {!unStyled && (
        <Card
          className={cn(
            "@container  w-full",
            className,
            "animate-in fade-in duration-300",
          )}
        >
          {title || description ? (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          ) : null}
          <CardContent>{children}</CardContent>
        </Card>
      )}
    </PageBlockProvider>
  );
}

export function FullWidthPageBlock({
  children,
  className,
  id,
}: Pick<PageBlockProps, "children" | "className" | "id">) {
  const contextValue = React.useMemo(
    () => ({
      id,
      column: "full" as const,
    }),
    [id],
  );
  return (
    <PageBlockProvider {...contextValue}>
      <div
        className={cn("w-full", className, "animate-in fade-in duration-300")}
      >
        {children}
      </div>
    </PageBlockProvider>
  );
}
