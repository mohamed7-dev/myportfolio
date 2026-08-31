import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
import {
  createAchievementInputSchema,
  createAchievementOutputSchema,
  deleteAchievementsInputSchema,
  deleteAchievementsOutputSchema,
  updateAchievementInputSchema,
  updateAchievementOutputSchema,
} from "@/lib/dto/achievement";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { achievementService } from "@/services/domain/achievement.service";

export const { POST, PATCH, DELETE } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createAchievementInputSchema);
      const result = await achievementService.create(ctx, parsedData);

      const parsedResult = validateOutput(
        result,
        createAchievementOutputSchema,
      );

      revalidatePath("/achievements", "page");
      revalidateTag(cacheKeys.publicAchievements[0], "max");

      return { body: parsedResult, init: { status: 201 } };
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateAchievementInputSchema);

      const result = await achievementService.update(ctx, parsedData);

      const parsedResult = validateOutput(
        result,
        updateAchievementOutputSchema,
      );

      revalidatePath("/achievements", "page");
      revalidateTag(cacheKeys.publicAchievements[0], "max");

      return { body: parsedResult, init: { status: 200 } };
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteAchievementsInputSchema);

      const result = await achievementService.delete(ctx, parsedData);

      const parsedResult = validateOutput(
        result,
        deleteAchievementsOutputSchema,
      );

      revalidatePath("/achievements", "page");
      revalidateTag(cacheKeys.publicAchievements[0], "max");

      return { body: parsedResult, init: { status: 200 } };
    },
  },
});
