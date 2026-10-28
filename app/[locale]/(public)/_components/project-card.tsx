import { FolderIcon } from "lucide-react";
import Link from "next/link";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { getScopedI18n } from "@/i18n/server";

export async function ProjectCard({ children }: { children: React.ReactNode }) {
  const i18n = await getScopedI18n("home.cards.projects");

  return (
    <CardWrapper interactive className="md:col-span-2">
      <div className="h-77 flex flex-row gap-2">
        <Link
          href="/projects"
          className="w-1/3 flex flex-col self-center"
          aria-label={i18n("title")}
        >
          <IconTile>
            <FolderIcon className="size-6" />
          </IconTile>
          <h3 className="mt-4 whitespace-pre-line leading-none tracking-wider uppercase font-heading text-sm md:text-lg text-foreground">
            {i18n("title")}
          </h3>
          <p className="mt-2 text-xs font-base leading-4 text-foreground">
            {i18n("description")}
          </p>
        </Link>

        <div className="flex-1">{children}</div>
      </div>
    </CardWrapper>
  );
}
