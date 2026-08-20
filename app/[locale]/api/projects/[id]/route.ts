import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
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
    handler: async (_req, nextCtx, ctx) => {
      const { id } = await (nextCtx as { params: Promise<{ id: string }> })
        .params;

      const parsedInput = validateInput({ id }, deleteProjectInputSchema);

      const result = await projectService.delete(ctx, parsedInput);

      const parsedResult = validateOutput(result, deleteProjectOutputSchema);

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
