"use server";

import { cookies } from "next/headers";
import { ACCENT_COLOR_CLASSNAME_KEY } from "@/lib/constants";

export async function setAccentColor(accentColorClassName: string) {
  (await cookies()).set(ACCENT_COLOR_CLASSNAME_KEY, accentColorClassName, {
    path: "/",
  });
}

export async function clearAccentColor() {
  (await cookies()).delete(ACCENT_COLOR_CLASSNAME_KEY);
}
