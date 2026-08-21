import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getScopedI18n } from "@/i18n/server";
import { Card, CardContent } from "../ui/card";

interface NotFoundPageProps {
  title?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}

export async function NotFoundPage({
  title,
  description,
  href = "/",
  linkLabel,
}: NotFoundPageProps) {
  const i18n = await getScopedI18n("defaultNotFoundPage");
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <Card className="max-w-105">
        <CardContent className="flex flex-col gap-4 text-foreground">
          <div className="mb-6 text-6xl font-bold text-foreground/60">404</div>

          <h1 className="text-2xl font-heading tracking-tight">
            {title ?? i18n("title")}
          </h1>

          <p className="mt-2 text-foreground/80">
            {description ?? i18n("description")}
          </p>

          <Button asChild className="mt-6">
            <Link href={href}>
              <ArrowLeftIcon />
              {linkLabel ?? i18n("linkLabel")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
