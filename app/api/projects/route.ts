import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
import {
  createProjectInputSchema,
  createProjectOutputSchema,
  softDeleteProjectsInputSchema,
  softDeleteProjectsOutputSchema,
  updateProjectInputSchema,
  updateProjectOutputSchema,
} from "@/lib/dto/project";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { projectService } from "@/services/domain/project.service";

export const { POST, PATCH, DELETE } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createProjectInputSchema);

      const result = await projectService.create(ctx, parsedData);

      const parsedResult = validateOutput(result, createProjectOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedProjects[0], "max");
      revalidatePath("/projects", "page");
      revalidateTag(cacheKeys.publicProjects[0], "max");

      return { body: parsedResult, init: { status: 201 } };
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateProjectInputSchema);

      const result = await projectService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateProjectOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedProjects[0], "max");
      revalidatePath("/projects", "page");
      revalidateTag(cacheKeys.publicProjects[0], "max");

      return { body: parsedResult, init: { status: 200 } };
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, softDeleteProjectsInputSchema);

      const result = await projectService.softDelete(ctx, parsedData);

      const parsedResult = validateOutput(
        result,
        softDeleteProjectsOutputSchema,
      );

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedProjects[0], "max");
      revalidatePath("/projects", "page");
      revalidateTag(cacheKeys.publicProjects[0], "max");

      return { body: parsedResult, init: { status: 200 } };
    },
  },
});
