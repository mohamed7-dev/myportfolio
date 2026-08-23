import { wrapService } from "@/api/common/create-router";
import { CookieConsent } from "@/components/app-layout/public-layout/cookie-consent";
import { PublicLayout as PublicLayoutImpl } from "@/components/app-layout/public-layout/public-layout";
import { PublicLayoutProvider } from "@/components/app-layout/public-layout/public-layout-provider";
import { getCurrentLocale } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { visitorService } from "@/services/domain/visitor.service";
import "./public.css";

export const revalidate = 3600;

export const getSuperAdminProfile = localizedCache(
  async (locale) => {
    const getSuperAdminProfile = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getSuperAdminProfileInfo,
      ctx: { params: Promise.resolve({ locale }) },
    });
    const profile = await getSuperAdminProfile();

    return profile;
  },
  cacheKeys.publicSuperAdminProfile,
  { revalidate: 3600, tags: cacheKeys.publicSuperAdminProfile },
);

export default async function PublicLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const profile = await getSuperAdminProfile(await getCurrentLocale());
  return (
    <PublicLayoutProvider profile={profile}>
      <CookieConsent />
      <div className="public-layout min-h-screen bg-background text-foreground overflow-hidden">
        <PublicLayoutImpl>{children}</PublicLayoutImpl>
      </div>
    </PublicLayoutProvider>
  );
}
