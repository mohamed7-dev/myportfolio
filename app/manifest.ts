import type { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // const t = await getTranslations({
  //   locale: routing.defaultLocale,
  //   namespace: "Manifest",
  // });

  return {
    // name: t("name"),
    name: "Test",
    start_url: "/",
    theme_color: "#101E33",
  };
}
