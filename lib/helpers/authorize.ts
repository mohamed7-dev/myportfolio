import { profileService } from "@/services/profile.service";

export async function authorize() {
  const session = await profileService().getSession();

  return !!session.token;
}
