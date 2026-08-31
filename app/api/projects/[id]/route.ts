import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
import {
  deleteProjectInputSchema,
  deleteProjectOutputSchema,
} from "@/lib/dto/project";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { projectService } from "@/services/domain/project.service";

export const { DELETE } = createRouter({
  DELETE: {
    authenticatedOnly: true,
    handler: async (_req, ctx, _headers, nextCtx) => {
      const { id } = await (nextCtx as { params: Promise<{ id: string }> })
        .params;

      const parsedInput = validateInput({ id }, deleteProjectInputSchema);

      const result = await projectService.delete(ctx, parsedInput);

      const parsedResult = validateOutput(result, deleteProjectOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedProjects[0], "max");
      revalidatePath("/projects", "page");
      revalidateTag(cacheKeys.publicProjects[0], "max");

      return { body: parsedResult, init: { status: 200 } };
    },
  },
});
