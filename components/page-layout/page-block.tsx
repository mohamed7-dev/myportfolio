import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const { title, description, className, children, srOnly = false } = props;

  return (
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
  );
}
