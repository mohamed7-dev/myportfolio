"use server";

import { cookies } from "next/headers";

export async function setAccent(accent: string) {
  const cookieStore = await cookies();

  cookieStore.set("accent", accent, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
