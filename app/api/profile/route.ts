import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
import {
  type UpdateProfileInputSchema,
  updateProfileInputSchema,
  updateProfileOutputSchema,
} from "@/lib/dto/profile";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { profileService } from "@/services/domain/profile.service";

export const { PATCH } = createRouter({
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateProfileInputSchema);

      const result = await profileService.update(
        ctx,
        parsedData as UpdateProfileInputSchema,
        {
          featuredAsset: true,
          assets: {
            asset: true,
          },
        },
      );

      const parsedOutput = validateOutput(result, updateProfileOutputSchema);

      revalidatePath("/about", "page");
      revalidatePath("/", "layout");
      revalidateTag(cacheKeys.publicSuperAdminProfile[0], "max");

      return { body: parsedOutput, init: { status: 200 } };
    },
  },
});
