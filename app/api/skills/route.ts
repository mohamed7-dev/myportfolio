import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
import {
  type CreateSkillInputSchema,
  createSkillInputSchema,
  createSkillOutputSchema,
  deleteSkillsInputSchema,
  deleteSkillsOutputSchema,
  type SkillListInputSchema,
  skillListInputSchema,
  skillListOutputSchema,
  type UpdateSkillInputSchema,
  updateSkillInputSchema,
  updateSkillOutputSchema,
} from "@/lib/dto/skill";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { skillService } from "@/services/domain/skill.service";

export const { POST, PATCH, DELETE, GET } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createSkillInputSchema);

      const result = await skillService.create(
        ctx,
        parsedData as CreateSkillInputSchema,
      );

      const parsedResult = validateOutput(result, createSkillOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedSkills[0], "max");
      revalidatePath("/about", "page");
      revalidateTag(cacheKeys.publicSkills[0], "max");

      return { body: parsedResult, init: { status: 201 } };
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateSkillInputSchema);

      const result = await skillService.update(
        ctx,
        parsedData as UpdateSkillInputSchema,
      );

      const parsedResult = validateOutput(result, updateSkillOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedSkills[0], "max");
      revalidatePath("/about", "page");
      revalidateTag(cacheKeys.publicSkills[0], "max");

      return { body: parsedResult, init: { status: 200 } };
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteSkillsInputSchema);

      const result = await skillService.delete(ctx, parsedData);

      const parsedResult = validateOutput(result, deleteSkillsOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedSkills[0], "max");
      revalidatePath("/about", "page");
      revalidateTag(cacheKeys.publicSkills[0], "max");

      return { body: parsedResult, init: { status: 200 } };
    },
  },
  GET: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const { searchParams } = new URL(req.url);

      const input = Object.fromEntries(
        searchParams.entries(),
      ) as unknown as SkillListInputSchema & { filter: string };
      const parsedInput = validateInput(
        {
          ...input,
          filter:
            input.filter &&
            input.filter !== "undefined" &&
            typeof input.filter === "string"
              ? JSON.parse(input.filter)
              : undefined,
        },
        skillListInputSchema,
      );

      const result = await skillService.find(ctx, parsedInput);
      const skills = validateOutput(result, skillListOutputSchema);
      return { body: skills, init: { status: 200 } };
    },
  },
});
