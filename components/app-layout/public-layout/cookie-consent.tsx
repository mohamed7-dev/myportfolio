"use client";

import React from "react";
import { toast } from "sonner";
import { clearAccentColor } from "@/api/actions/set-accent-color.action";
import { useScopedI18n } from "@/i18n/client";
import { PREFERENCES_CONSENT_KEY } from "@/lib/constants";

const ACCEPTED = "accepted";
const REJECTED = "rejected";

export function CookieConsent() {
  const i18n = useScopedI18n("cookieConsent");
  React.useEffect(() => {
    if (window.localStorage.getItem(PREFERENCES_CONSENT_KEY)) {
      return;
    }

    const toastId = toast(i18n("title"), {
      description: i18n("description"),
      duration: Infinity,
      action: {
        label: i18n("agree"),
        onClick: () => {
          window.localStorage.setItem(PREFERENCES_CONSENT_KEY, ACCEPTED);
          toast.dismiss(toastId);
        },
      },
      cancel: {
        label: i18n("reject"),
        onClick: async () => {
          window.localStorage.setItem(PREFERENCES_CONSENT_KEY, REJECTED);
          await clearAccentColor();
          toast.dismiss(toastId);
        },
      },
    });
  }, [i18n]);

  return null;
}
