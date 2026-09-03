import { FolderIcon } from "lucide-react";
import { IconTile } from "@/components/shared/icon-tile";
import { getScopedI18n } from "@/i18n/server";
import { BentoLink } from "./bento-link";

export async function ProjectCard({ children }: { children: React.ReactNode }) {
  const i18n = await getScopedI18n("home.cards.projects");

  return (
    <BentoLink href="/projects" className="md:col-span-2">
      <div className="h-77 flex flex-row gap-2">
        <div className="w-1/3 flex flex-col self-center">
          <IconTile>
            <FolderIcon className="size-6" />
          </IconTile>
          <h3 className="mt-4 whitespace-pre-line leading-none tracking-wider uppercase font-heading text-sm md:text-lg text-foreground">
            {i18n("title")}
          </h3>
          <p className="mt-2 text-xs font-base leading-4 text-foreground">
            {i18n("description")}
          </p>
        </div>

        <div className="flex-1 relative">{children}</div>
      </div>
    </BentoLink>
  );
}
