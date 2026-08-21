import { wrapService } from "@/api/common/create-router";
import { LanguageCode } from "@/lib/dto/language-code";
import { registerEnv } from "@/lib/helpers/env";
import { profileService } from "@/services/domain/profile.service";

registerEnv();

function getParams() {
  return new Promise<{ locale: LanguageCode }>((resolve) =>
    resolve({ locale: LanguageCode.en }),
  );
}

async function seedAdmin() {
  const ensureAdmin = wrapService({
    authenticatedOnly: false,
    handler: profileService.initAdmin,
    ctx: {
      params: getParams(),
    },
  });

  const result = await ensureAdmin();
  console.log("[Profile]: ", result);

  return result;
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
