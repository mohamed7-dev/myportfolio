import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { authenticateAdminUserInputSchema } from "@/lib/dto/auth";
import { validateInput } from "@/lib/helpers/validate-input";
import type { Profile } from "@/orm/entities/profile/profile.entity";
import { profileService } from "@/services/profile.service";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const parsedBody = validateInput(body, authenticateAdminUserInputSchema);

  const result = await profileService().authenticateAdminUser(parsedBody);

  (await cookies()).set("session", result.token);

  return NextResponse.json(clientSafeProfile(result.profile));
};

function clientSafeProfile(profile: Profile) {
  return {
    summary: profile.summary,
    username: profile.username,
  };
}

export const PUT = async () => {
  const res: { success: boolean } = { success: false };
  const sessionToken = (await cookies()).get("session");
  if (sessionToken) {
    await profileService().logoutAdminUser(sessionToken.value);
    (await cookies()).delete("session");
    res.success = true;
  }

  return NextResponse.json(res);
};
