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
): Promise<Response>;

export function api(
  routeConfig: JsonRouteConfig,
  body: object,
  isProtected?: boolean,
): Promise<Response>;

export function api(
  routeConfig: MultipartRouteConfig,
  body: FormData,
  isProtected?: boolean,
): Promise<Response>;

export function api(
  routeConfig: EmptyRouteConfig | JsonRouteConfig | MultipartRouteConfig,
  body?: object | FormData,
  isProtected = false,
) {
  let requestBody: BodyInit | undefined;

  if (routeConfig.contentType === "application/json") {
    requestBody = JSON.stringify(body);
  } else if (routeConfig.contentType === "multipart/form-data") {
    requestBody = body as FormData;
  }

  return fetch(routeConfig.url, {
    method: routeConfig.method,
    credentials: isProtected ? "include" : "omit",

    ...(requestBody !== undefined && {
      body: requestBody,
    }),

    ...(routeConfig.contentType === "application/json" && {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  });
}
