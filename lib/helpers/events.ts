import type { Asset, EntityAsset } from "../dto/asset";

const EVENT_NAME = "form-submitted";

export type FormSubmittedEventPayload = {
  formType: "create" | "update";
  assets?: EntityAsset[];
  featuredAsset?: Asset;
};

export function formSubmittedEvent() {
  return {
    eventName: EVENT_NAME,
    emit(
      type: "create" | "update",
      assets?: EntityAsset[],
      featuredAsset?: Asset,
    ) {
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: {
            formType: type,
            assets: assets
              ?.sort((a, b) => a.position - b.position)
              ?.map((pa) => pa.asset),
            featuredAsset,
          },
        }),
      );
    },
  };
}
