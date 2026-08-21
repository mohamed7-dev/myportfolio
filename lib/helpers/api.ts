import { LOCALE_HEADER } from "@/lib/constants";
import type { LanguageCode } from "@/lib/dto/language-code";

type BaseRouteConfig = {
  url: string;
  method: string;
};

type JsonRouteConfig = BaseRouteConfig & {
  contentType: "application/json";
};

type MultipartRouteConfig = BaseRouteConfig & {
  contentType: "multipart/form-data";
};

type EmptyRouteConfig = BaseRouteConfig & {
  contentType: null;
};

export function api(
  routeConfig: EmptyRouteConfig,
  body?: undefined,
  isProtected?: boolean,
  locale?: LanguageCode,
): Promise<Response>;

export function api(
  routeConfig: JsonRouteConfig,
  body: object,
  isProtected?: boolean,
  locale?: LanguageCode,
): Promise<Response>;

export function api(
  routeConfig: MultipartRouteConfig,
  body: FormData,
  isProtected?: boolean,
  locale?: LanguageCode,
): Promise<Response>;

export function api(
  routeConfig: EmptyRouteConfig | JsonRouteConfig | MultipartRouteConfig,
  body?: object | FormData,
  isProtected = false,
  locale?: LanguageCode,
) {
  let requestBody: BodyInit | undefined;

  if (routeConfig.contentType === "application/json") {
    requestBody = JSON.stringify(body);
  } else if (routeConfig.contentType === "multipart/form-data") {
    requestBody = body as FormData;
  }

  return fetch(routeConfig.url, {
    method: routeConfig.method,
    credentials: isProtected ? "include" : "same-origin",

    ...(requestBody !== undefined && {
      body: requestBody,
    }),

    ...(routeConfig.contentType === "application/json" && {
      headers: {
        "Content-Type": "application/json",
        ...(locale && { [LOCALE_HEADER]: locale }),
      },
    }),

    ...(locale &&
      routeConfig.contentType !== "application/json" && {
        headers: { [LOCALE_HEADER]: locale },
      }),
  });
}
