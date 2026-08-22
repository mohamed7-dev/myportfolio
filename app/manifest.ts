import type { MetadataRoute } from "next";
import { wrapService } from "@/api/common/create-router";
import { sharedConfig } from "@/lib/config/shared-config";
import { visitorService } from "@/services/domain/visitor.service";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const getProfile = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getSuperAdminProfileInfo,
  });
  const profile = await getProfile();
  const name = profile.displayName || profile.username;

  return {
    name,
    short_name: name,
    description: profile.intro || profile.subtitle || profile.jobTitle,
    start_url: `/${sharedConfig.i18n.defaultLocale}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#101E33",
    lang: profile.languageCode,
    dir: profile.languageCode === "ar" ? "rtl" : "ltr",
  };
}
