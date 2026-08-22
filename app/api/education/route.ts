import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
import {
  createEducationInputSchema,
  createEducationOutputSchema,
  deleteEducationsInputSchema,
  deleteEducationsOutputSchema,
  updateEducationInputSchema,
  updateEducationOutputSchema,
} from "@/lib/dto/education";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { educationService } from "@/services/domain/education.service";

export const { POST, PATCH, DELETE } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createEducationInputSchema);
      const result = await educationService.create(ctx, parsedData);

      const parsedResult = validateOutput(result, createEducationOutputSchema);

      revalidatePath("/career", "page");
      revalidateTag(cacheKeys.publicEducation[0], "");

      return NextResponse.json(parsedResult, { status: 201 });
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateEducationInputSchema);

      const result = await educationService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateEducationOutputSchema);
      revalidatePath("/career", "page");
      revalidateTag(cacheKeys.publicEducation[0], "");
      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteEducationsInputSchema);

      const result = await educationService.delete(ctx, parsedData);

      const parsedResult = validateOutput(result, deleteEducationsOutputSchema);
      revalidatePath("/career", "page");
      revalidateTag(cacheKeys.publicEducation[0], "");
      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
