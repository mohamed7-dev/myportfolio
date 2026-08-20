import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  careerListInputSchema,
  careerListOutputSchema,
  createCareerInputSchema,
  createCareerOutputSchema,
  deleteCareersInputSchema,
  deleteCareersOutputSchema,
  updateCareerInputSchema,
  updateCareerOutputSchema,
} from "@/lib/dto/career";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { careerService } from "@/services/domain/career.service";

export const { POST, PATCH, DELETE } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createCareerInputSchema);
      const result = await careerService.create(ctx, parsedData);

      const parsedResult = validateOutput(result, createCareerOutputSchema);

      return NextResponse.json(parsedResult, { status: 201 });
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateCareerInputSchema);

      const result = await careerService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateCareerOutputSchema);

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteCareersInputSchema);

      const result = await careerService.delete(ctx, parsedData);

      const parsedResult = validateOutput(result, deleteCareersOutputSchema);

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
