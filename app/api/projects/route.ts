import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  createProjectInputSchema,
  softDeleteProjectsInputSchema,
  updateProjectInputSchema,
} from "@/lib/dto/project";
import { validateInput } from "@/lib/helpers/validate-input";
import { projectService } from "@/services/domain/project.service";

export const { POST, PATCH, DELETE } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createProjectInputSchema);

      const result = await projectService.create(ctx, parsedData);

      return NextResponse.json(result);
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateProjectInputSchema);

      const result = await projectService.update(ctx, parsedData);

      return NextResponse.json(result);
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, softDeleteProjectsInputSchema);

      const result = await projectService.softDelete(ctx, parsedData);

      return NextResponse.json(result);
    },
  },
});
