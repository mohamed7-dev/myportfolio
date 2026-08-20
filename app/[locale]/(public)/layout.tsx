import { wrapService } from "@/api/common/create-router";
import { PublicLayout as PublicLayoutImpl } from "@/components/app-layout/public-layout/public-layout";
import { PublicLayoutProvider } from "@/components/app-layout/public-layout/public-layout-provider";
import { routing } from "@/i18n/routing";
import { visitorService } from "@/services/domain/visitor.service";
import "./public.css";

export function generateStaticParams() {
  return routing.locales.map((l) => ({ locale: l }));
}

export default async function PublicLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const getSuperAdminProfile = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getSuperAdminProfileInfo,
  });
  const profile = await getSuperAdminProfile();
  return (
    <PublicLayoutProvider profile={profile}>
      <div className="public-layout min-h-screen bg-background text-foreground overflow-hidden">
        <PublicLayoutImpl>{children}</PublicLayoutImpl>
      </div>
    </PublicLayoutProvider>
  );
}
