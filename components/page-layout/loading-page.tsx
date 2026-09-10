import { Loader2Icon } from "lucide-react";
import { getI18n } from "@/i18n/server";

export async function LoadingPage() {
  const i18n = await getI18n();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-base border-2 border-border bg-secondary-background p-8 text-center shadow-default">
        <div className="flex size-16 items-center justify-center rounded-base border-2 border-border bg-primary shadow-default">
          <Loader2Icon aria-hidden="true" className="size-8 animate-spin" />
        </div>
        <p className="font-heading text-xl">{i18n("loading")}</p>
      </div>
    </main>
  );
}
