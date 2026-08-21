import { redirect } from "next/navigation";
import { DashboardLayout as DashboardLayoutImpl } from "@/components/app-layout/dashboard-layout";
import { requestContextService } from "@/services/helpers/request-context.service";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/[locale]/dashboard">) {
  const requestContext = await requestContextService.create(
    undefined,
    undefined,
    true,
  );

  if (!requestContext.isAuthenticated) {
    redirect("/login", "replace");
  }

  return <DashboardLayoutImpl>{children} </DashboardLayoutImpl>;
}
