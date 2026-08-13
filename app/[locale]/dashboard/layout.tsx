import { DashboardLayout as DashboardLayoutImpl } from "@/components/app-layout/dashboard-layout";
import { redirect } from "@/i18n/navigation";
import { requestContextService } from "@/services/helpers/request-context.service";

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  const requestContext = await requestContextService.create(
    undefined,
    undefined,
    true,
  );

  if (!requestContext.isAuthenticated) {
    redirect({ href: "/login", locale });
  }

  return <DashboardLayoutImpl>{children} </DashboardLayoutImpl>;
}
