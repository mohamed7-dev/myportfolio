"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { RichTextDisplay } from "@/components/shared/rich-text-editor/rich-text-display";
import { Button } from "@/components/ui/button";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

type ChallengesSliderProps = {
  challenges: string[];
  className?: string;
};

export function ChallengesSlider({
  challenges,
  className,
}: ChallengesSliderProps) {
  const [current, setCurrent] = useState(0);
  const { formatNumber } = useLocalFormatter();
  const i18n = useI18n();

  if (!challenges.length) {
    return null;
  }

  const isFirst = current === 0;
  const isLast = current === challenges.length - 1;

  return (
    <div className={cn("w-full", className)}>
      {/* Challenge */}
      <RichTextDisplay
        key={current}
        className="animate-in fade-in duration-300"
        html={challenges[current]}
      />

      {/* Navigation */}
      {challenges.length > 1 && (
        <div className="mt-8 flex rtl:flex-row-reverse items-center justify-center gap-4">
          <Button
            size="sm"
            variant="neutralNoShadow"
            className="pointer-events-auto"
            onClick={() => setCurrent((value) => value - 1)}
            disabled={isFirst}
          >
            <span>{i18n("previous")}</span>
            <ChevronLeftIcon />
          </Button>

          <span className="min-w-16 text-center text-sm font-heading">
            {formatNumber(current + 1)} / {formatNumber(challenges.length)}
          </span>

          <Button
            size="sm"
            variant="neutralNoShadow"
            className="pointer-events-auto"
            onClick={() => setCurrent((value) => value + 1)}
            disabled={isLast}
          >
            <ChevronRightIcon />
            <span>{i18n("next")}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
