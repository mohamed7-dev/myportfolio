import { cookies } from "next/headers";
import { themes } from "../theme";

export async function getAccentColor() {
  const cookieStore = await cookies();

  const accent =
    cookieStore.get("accent")?.value ?? themes.lightEmerald.className;

  return accent;
}
