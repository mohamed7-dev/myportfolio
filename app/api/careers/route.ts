import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
import {
  type CareerListInputSchema,
  type CreateCareerInputSchema,
  careerListInputSchema,
  careerListOutputSchema,
  createCareerInputSchema,
  createCareerOutputSchema,
  deleteCareersInputSchema,
  deleteCareersOutputSchema,
  type UpdateCareerInputSchema,
  updateCareerInputSchema,
  updateCareerOutputSchema,
} from "@/lib/dto/career";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { careerService } from "@/services/domain/career.service";

export const { POST, PATCH, DELETE, GET } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createCareerInputSchema);
      const result = await careerService.create(
        ctx,
        parsedData as CreateCareerInputSchema,
      );

      const parsedResult = validateOutput(result, createCareerOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedCareers[0], "max");
      revalidatePath("/career", "page");
      revalidateTag(cacheKeys.publicCareers[0], "max");

      return {
        body: parsedResult,
        init: {
          status: 201,
        },
      };
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateCareerInputSchema);

      const result = await careerService.update(
        ctx,
        parsedData as UpdateCareerInputSchema,
      );

      const parsedResult = validateOutput(result, updateCareerOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedCareers[0], "max");
      revalidatePath("/career", "page");
      revalidateTag(cacheKeys.publicCareers[0], "max");
      return {
        body: parsedResult,
        init: {
          status: 200,
        },
      };
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteCareersInputSchema);

      const result = await careerService.delete(ctx, parsedData);

      const parsedResult = validateOutput(result, deleteCareersOutputSchema);

      revalidatePath("/", "page");
      revalidateTag(cacheKeys.publicFeaturedCareers[0], "max");
      revalidatePath("/career", "page");
      revalidateTag(cacheKeys.publicCareers[0], "max");
      return {
        body: parsedResult,
        init: {
          status: 200,
        },
      };
    },
  },
  GET: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const { searchParams } = new URL(req.url);

      const input = Object.fromEntries(
        searchParams.entries(),
      ) as unknown as CareerListInputSchema & { filter: string };
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
        careerListInputSchema,
      );

      const result = await careerService.find(ctx, parsedInput);
      const careers = validateOutput(result, careerListOutputSchema);
      return { body: careers, init: { status: 200 } };
    },
  },
});
