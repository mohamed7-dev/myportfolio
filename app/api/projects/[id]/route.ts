import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import { deletionResponseSchema, inputIdSchema } from "@/lib/dto/common";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { projectService } from "@/services/domain/project.service";

export const { DELETE } = createRouter({
  DELETE: {
    authenticatedOnly: true,
    handler: async (_req, nextCtx, ctx) => {
      const { id } = await (nextCtx as { params: Promise<{ id: string }> })
        .params;

      const parsedInput = validateInput({ id }, inputIdSchema);

      const result = await projectService.delete(ctx, parsedInput);

      const parsedResult = validateOutput(result, deletionResponseSchema);

      return NextResponse.json(parsedResult);
    },
  },
});
