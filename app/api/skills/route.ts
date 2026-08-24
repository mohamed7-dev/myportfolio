import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
import {
  createSkillInputSchema,
  createSkillOutputSchema,
  deleteSkillsInputSchema,
  deleteSkillsOutputSchema,
  updateSkillInputSchema,
  updateSkillOutputSchema,
} from "@/lib/dto/skill";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { skillService } from "@/services/domain/skill.service";

export const { POST, PATCH, DELETE } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createSkillInputSchema);

      const result = await skillService.create(ctx, parsedData);

      const parsedResult = validateOutput(result, createSkillOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedSkills[0], "max");
      revalidatePath("/about", "page");
      revalidateTag(cacheKeys.publicSkills[0], "max");

      return NextResponse.json(parsedResult, { status: 201 });
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateSkillInputSchema);

      const result = await skillService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateSkillOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedSkills[0], "max");
      revalidatePath("/about", "page");
      revalidateTag(cacheKeys.publicSkills[0], "max");

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteSkillsInputSchema);

      const result = await skillService.delete(ctx, parsedData);

      const parsedResult = validateOutput(result, deleteSkillsOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedSkills[0], "max");
      revalidatePath("/about", "page");
      revalidateTag(cacheKeys.publicSkills[0], "max");

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
