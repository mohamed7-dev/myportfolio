import { redirect } from "next/navigation";
import { isAuthenticated } from "@/api/common/is-authenticated";
import { DashboardLayout as DashboardLayoutImpl } from "@/components/app-layout/dashboard-layout";
import { QueryClientProvider } from "@/components/providers/query-client-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/[locale]/dashboard">) {
  const shouldRedirect = !(await isAuthenticated());

  if (shouldRedirect) {
    redirect("/login", "replace");
  }

  return (
    <DashboardLayoutImpl>
      <QueryClientProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </DashboardLayoutImpl>
  );
}
