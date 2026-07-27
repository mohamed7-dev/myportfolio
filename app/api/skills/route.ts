import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  createSkillInputSchema,
  deleteSkillsInputSchema,
  updateSkillInputSchema,
} from "@/lib/dto/skill";
import { validateInput } from "@/lib/helpers/validate-input";
import { skillService } from "@/services/domain/skill.service";

export const { POST, PATCH, DELETE } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createSkillInputSchema);

      const result = await skillService.create(ctx, parsedData);

      return NextResponse.json(result);
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateSkillInputSchema);

      const result = await skillService.update(ctx, parsedData);

      return NextResponse.json(result);
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteSkillsInputSchema);

      const result = await skillService.delete(ctx, parsedData);

      return NextResponse.json(result);
    },
  },
});
