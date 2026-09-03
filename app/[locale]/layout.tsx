import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import "./globals.css";
import "reflect-metadata";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { wrapService } from "@/api/common/create-router";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { sharedConfig } from "@/lib/config/shared-config";
import { ACCENT_COLOR_CLASSNAME_KEY } from "@/lib/constants";
import type { LanguageCode } from "@/lib/dto/language-code";
import { isRtl } from "@/lib/helpers/locale-utils";
import { themes } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { visitorService } from "@/services/domain/visitor.service";

const Analytics = dynamic(() =>
  import("@vercel/analytics/next").then((mod) => mod.Analytics),
);

const Toaster = dynamic(() =>
  import("@/components/ui/sonner").then((mod) => mod.Toaster),
);

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

const ibmPlexSansAr = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-ar",
  subsets: ["arabic", "latin"],
  weight: ["200", "400", "700"],
});

const getProfile = wrapService({
  authenticatedOnly: false,
  handler: visitorService.getSuperAdminProfileInfo,
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = profile.displayName || profile.username;
  const description = profile.intro || profile.subtitle || profile.jobTitle;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? sharedConfig.server.host,
    ),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    applicationName: title,
    authors: [{ name: title }],
    creator: title,
    alternates: {
      languages: Object.fromEntries(
        sharedConfig.i18n.locales.map(({ key }) => [key, `/${key}`]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: title,
      title,
      description,
      locale: profile.languageCode,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  const typedLocale = locale as LanguageCode;

  const accentColor = (await cookies()).get(ACCENT_COLOR_CLASSNAME_KEY);

  const accentColorClassName =
    accentColor?.value ?? themes.lightEmerald.className;

  return (
    <html
      lang={typedLocale}
      dir={isRtl(typedLocale) ? "rtl" : "ltr"}
      className={cn(
        "h-full antialiased",
        isRtl(typedLocale) ? ibmPlexSansAr.variable : ibmPlexSans.variable,
        ibmPlexMono.variable,
        accentColorClassName,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Toaster />
        <I18nProvider locale={locale}>{children}</I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
