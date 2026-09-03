import { cn } from "@/lib/utils";

type RichTextProps = {
  html: string;
  className?: string;
};

export function RichTextDisplay({ html, className }: RichTextProps) {
  return (
    <div
      className={cn(
        `
        [&_h3]:mb-4
        [&_h3]:text-base
        [&_h3]:lg:text-lg
        [&_h3]:font-heading
        [&_h3]:tracking-tight

        [&_h4]:mb-2
        [&_h4]:mt-6
        [&_h4]:text-sm
        [&_h4]:lg:text-base
        [&_h4]:font-heading

        [&_p]:mb-4
        [&_p]:leading-7

        [&_strong]:font-heading

        [&_code]:inline
        [&_code]:align-middle
        [&_code]:rounded-base
        [&_code]:border-2
        [&_code]:px-1.5
        [&_code]:py-0.5
        [&_code]:font-mono
        [&_code]:text-xs
        [&_code]:whitespace-nowrap

        [&_ul]:mb-4
        [&_ul]:list-disc
        [&_ul]:pl-6

        [&_ol]:mb-4
        [&_ol]:list-decimal
        [&_ol]:pl-6

        [&_li]:mb-1

        [&_a]:font-medium
        [&_a]:underline
        `,
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
