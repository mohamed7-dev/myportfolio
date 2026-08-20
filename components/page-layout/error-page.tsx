"use client";

import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";

interface ErrorPageProps {
  title?: string;
  description?: string;
  reset?: () => void;
}

export function ErrorPage({ title, description, reset }: ErrorPageProps) {
  const i18n = useTranslations("defaultErrorPage");
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <Card className="max-w-105">
        <CardContent className="flex flex-col gap-4 text-foreground">
          <div className="mb-6 text-6xl font-bold text-foreground/60">500</div>
          <h2 className="text-2xl font-heading tracking-tight">
            {title ?? i18n("title")}
          </h2>
          <p className="mt-2 text-foreground/80">
            {description ?? i18n("description")}
          </p>
          {reset && (
            <Button onClick={reset} className="mt-6">
              <RefreshCcw />
              {i18n("actionLabel")}
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
