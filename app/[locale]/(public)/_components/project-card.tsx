import { FolderIcon } from "lucide-react";
import { IconTile } from "@/components/shared/icon-tile";
import { getScopedI18n } from "@/i18n/server";
import { BentoLink } from "./bento-link";

export async function ProjectCard({ children }: { children: React.ReactNode }) {
  const i18n = await getScopedI18n("home.cards.projects");

  return (
    <BentoLink href="/projects" className="md:col-span-2">
      <div className="min-h-77 flex">
        <div className="max-w-42.5 self-center">
          <IconTile>
            <FolderIcon className="size-6" />
          </IconTile>
          <h3 className="mt-4 whitespace-pre-line leading-none tracking-wider uppercase font-heading text-sm md:text-lg text-foreground">
            {i18n("title").replace(" ", "\n")}
          </h3>
          <p className="mt-2 text-xs font-base leading-4 text-foreground">
            {i18n("description")}
          </p>
        </div>
        <div className="flex w-42.5 flex-col gap-5 sm:right-5">{children}</div>
      </div>
    </BentoLink>
  );
}
