import { createRouter } from "@/api/common/create-router";
import {
  type TagListInputSchema,
  tagListInputSchema,
  tagListOutputSchema,
} from "@/lib/dto/tag";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { tagService } from "@/services/domain/tag.service";

export const { GET } = createRouter({
  GET: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const { searchParams } = new URL(req.url);

      const input = Object.fromEntries(
        searchParams.entries(),
      ) as unknown as TagListInputSchema & { filter: string };
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
        tagListInputSchema,
      );

      const result = await tagService.find(ctx, parsedInput);
      const tags = validateOutput(result, tagListOutputSchema);
      return { body: tags, init: { status: 200 } };
    },
  },
});
