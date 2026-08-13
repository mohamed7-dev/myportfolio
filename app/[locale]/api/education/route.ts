import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
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

      return NextResponse.json(parsedResult);
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateEducationInputSchema);

      const result = await educationService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateEducationOutputSchema);

      return NextResponse.json(parsedResult);
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteEducationsInputSchema);

      const result = await educationService.delete(ctx, parsedData);

      const parsedResult = validateOutput(result, deleteEducationsOutputSchema);

      return NextResponse.json(parsedResult);
    },
  },
});
