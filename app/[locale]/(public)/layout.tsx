import { wrapService } from "@/api/common/create-router";
import { PublicLayout as PublicLayoutImpl } from "@/components/app-layout/public-layout/public-layout";
import { PublicLayoutProvider } from "@/components/app-layout/public-layout/public-layout-provider";
import { visitorService } from "@/services/domain/visitor.service";
import "./public.css";
import { setStaticParamsLocale } from "next-international/server";
import { getStaticParams } from "@/i18n/server";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function PublicLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

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
