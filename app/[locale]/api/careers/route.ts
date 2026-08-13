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

export const { POST, PATCH, DELETE, GET } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createCareerInputSchema);
      const result = await careerService.create(ctx, parsedData);

      const parsedResult = validateOutput(result, createCareerOutputSchema);

      return NextResponse.json(parsedResult);
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateCareerInputSchema);

      const result = await careerService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateCareerOutputSchema);

      return NextResponse.json(parsedResult);
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteCareersInputSchema);

      const result = await careerService.delete(ctx, parsedData);

      const parsedResult = validateOutput(result, deleteCareersOutputSchema);

      return NextResponse.json(parsedResult);
    },
  },
  GET: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const searchParams = Object.fromEntries(
        req.nextUrl.searchParams.entries(),
      );

      // TODO: we need to find a way to make zod parse the JSON input before validation
      const parsedSearchParams = validateInput(
        "filter" in searchParams && searchParams.filter
          ? { ...searchParams, filter: JSON.parse(searchParams.filter) }
          : searchParams,
        careerListInputSchema,
      );
      const result = await careerService.find(ctx, parsedSearchParams);

      const parsedResult = validateOutput(result, careerListOutputSchema);

      return NextResponse.json(parsedResult);
    },
  },
});
