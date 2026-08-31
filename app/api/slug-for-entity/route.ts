import { createRouter } from "@/api/common/create-router";
import {
  slugForEntityInputSchema,
  slugForEntityOutputSchema,
} from "@/lib/dto/slug";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { slugService } from "@/services/helpers/slug.service";

export const { PUT } = createRouter({
  PUT: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();
      const parsedInput = validateInput(body, slugForEntityInputSchema);
      const result = await slugService.slugForEntity(ctx, parsedInput);
      const parsedResult = validateOutput(result, slugForEntityOutputSchema);
      return { body: parsedResult, init: { status: 200 } };
    },
  },
});
