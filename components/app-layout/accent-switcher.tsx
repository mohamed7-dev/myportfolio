"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useTransition } from "react";
import { setAccentColor } from "@/api/actions/set-accent-color.action";
import {
  ACCENT_COLOR_CLASSNAME_KEY,
  PREFERENCES_CONSENT_KEY,
} from "@/lib/constants";
import { themes } from "@/lib/theme";
import { DynamicLoader } from "../shared/dynamic-loader";
import { Button } from "../ui/button";

const DashboardAccentSwitcher = dynamic(
  () =>
    import("./dashboard-accent-switcher").then(
      (mod) => mod.DashboardAccentSwitcher,
    ),
  {
    loading: () => <DynamicLoader />,
  },
);

export function AccentSwitcher({ mode }: { mode: "dashboard" | "public" }) {
  const [accentClassName, setAccentClassName] = useState("");

  const [_, startTransition] = useTransition();

  const onChange = (value: string) => {
    const changeAccent = () => {
      const allAccentClassNames = Object.values(themes)
        .map((theme) => theme.className)
        .filter(Boolean);
      const documentElAccentClassName = allAccentClassNames.find((className) =>
        document.documentElement.classList.contains(className),
      );

      if (documentElAccentClassName) {
        document.documentElement.classList.remove(documentElAccentClassName);
      }
      if (value) {
        document.documentElement.classList.add(value);
      }
    };

    if ("startViewTransition" in document) {
      document.startViewTransition(changeAccent);
    } else {
      changeAccent();
    }

    startTransition(async () => {
      setAccentClassName(value);
      if (window.localStorage.getItem(PREFERENCES_CONSENT_KEY) === "accepted") {
        await setAccentColor(value);
      }
    });
  };

  useEffect(() => {
    const getAccentColor = async () => {
      const accent = await window.cookieStore.get(ACCENT_COLOR_CLASSNAME_KEY);
      if (accent?.value) {
        setAccentClassName(accent.value);
      }
    };
    getAccentColor();
  }, []);

  if (mode === "dashboard") {
    return (
      <DashboardAccentSwitcher onChange={onChange} value={accentClassName} />
    );
  }

  return (
    <div className="flex items-center gap-2">
      {Object.values(themes).map((theme) => (
        <Button
          key={theme.name}
          variant={"neutralNoShadow"}
          size={"icon-xs"}
          onClick={() => onChange(theme.className)}
          className="size-auto rounded-base"
        >
          <span
            className="block size-6"
            style={{ backgroundColor: theme.labelColor }}
          ></span>
          <span className="sr-only">
            {theme.name} {theme.isDefault && "(Default)"}
          </span>
        </Button>
      ))}
    </div>
  );
}
