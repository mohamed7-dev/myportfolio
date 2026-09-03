import type React from "react";
import { cn } from "@/lib/utils";

export function CardWrapper({
  cardTitle,
  className,
  children,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  cardTitle?: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <article
      {...props}
      className={cn(
        "group p-2 md:p-4 bg-background rounded-base border-2 border-border overflow-hidden transition-all duration-300",
        interactive && "hover:-translate-y-1 hover:border-border/50 ",
        className,
      )}
    >
      {cardTitle && (
        <h3 className="font-heading text-sm md:text-lg text-foreground mb-3 capitalize">
          {cardTitle}
        </h3>
      )}
      {children}
    </article>
  );
}
