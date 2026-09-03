import { cn } from "@/lib/utils";
import { RichTextDisplay } from "./rich-text-display";

export function RichTextListDisplay({
  html,
  className,
}: {
  className?: string;
  html: string;
}) {
  return (
    <RichTextDisplay
      html={html}
      className={cn(
        "[&_li]:bg-background [&_li]:p-2 [&_li]:rounded-base [&_p]:m-0 [&_li]:mb-2 [&_li_p>strong:first-child]:block",
        className,
      )}
    />
  );
}
