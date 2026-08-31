import { BriefcaseIcon } from "lucide-react";
import type React from "react";
import { IconTile } from "@/components/shared/icon-tile";
import { getScopedI18n } from "@/i18n/server";
import { BentoLink } from "./bento-link";

export async function CareerCard({ children }: { children: React.ReactNode }) {
  const i18n = await getScopedI18n("home.cards.career");

  return (
    <BentoLink href="/career" className="md:col-span-2">
      <div className="flex min-h-77 flex-col items-center p-6 text-center">
        <IconTile>
          <BriefcaseIcon className="size-6" />
        </IconTile>
        <h3 className="mt-4 whitespace-pre-line leading-none tracking-wider uppercase font-heading text-sm md:text-lg text-foreground">
          {i18n("title")}
        </h3>
        <p className="mt-2 max-w-42.5 text-xs leading-4 text-foreground">
          {i18n("description")}
        </p>
        {children}
      </div>
    </BentoLink>
  );
}
