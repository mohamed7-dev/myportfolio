import { cn } from "@/lib/utils";

export function IconTile({
  children,
  className,
  asSpan = false,
}: {
  children: React.ReactNode;
  className?: string;
  asSpan?: boolean;
}) {
  const Comp = asSpan ? "span" : "div";
  return (
    <Comp
      className={cn(
        "flex size-12 items-center justify-center rounded-base bg-primary text-primary-foreground transition duration-300 group-hover:scale-105",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
