import { type NextRequest, NextResponse } from "next/server";
import { clientSafeSchema, updateProfileInputSchema } from "@/lib/dto/profile";
import { authorize } from "@/lib/helpers/authorize";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { profileService } from "@/services/profile.service";

export async function PATCH(req: NextRequest) {
  await authorize();

  const body = await req.json();

  const parsedData = validateInput(body, updateProfileInputSchema);

  const result = await profileService().update(parsedData);

  const parsedOutput = validateOutput(result, clientSafeSchema);

  return NextResponse.json(parsedOutput);
}
