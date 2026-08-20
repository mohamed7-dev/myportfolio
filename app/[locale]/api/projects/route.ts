import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
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
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createProjectInputSchema);

      const result = await projectService.create(ctx, parsedData);

      const parsedResult = validateOutput(result, createProjectOutputSchema);

      return NextResponse.json(parsedResult, { status: 201 });
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateProjectInputSchema);

      const result = await projectService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateProjectOutputSchema);

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, softDeleteProjectsInputSchema);

      const result = await projectService.softDelete(ctx, parsedData);

      const parsedResult = validateOutput(
        result,
        softDeleteProjectsOutputSchema,
      );

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
