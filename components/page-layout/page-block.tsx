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
  srOnly?: boolean;
}

export function PageBlock(props: PageBlockProps) {
  const {
    id,
    title,
    description,
    column,
    className,
    children,
    srOnly = false,
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
      <Card
        className={cn(
          "@container  w-full",
          className,
          "animate-in fade-in duration-300",
        )}
      >
        {title || description ? (
          <CardHeader className={cn(srOnly && "sr-only")}>
            {title && (
              <CardTitle className={cn(srOnly && "sr-only")}>
                <h2>{title}</h2>
              </CardTitle>
            )}
            {description && (
              <CardDescription>
                <p>{description}</p>
              </CardDescription>
            )}
          </CardHeader>
        ) : null}
        <CardContent>{children}</CardContent>
      </Card>
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
