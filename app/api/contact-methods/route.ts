import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  createContactMethodInputSchema,
  createContactMethodOutputSchema,
  deleteContactMethodsInputSchema,
  deleteContactMethodsOutputSchema,
  updateContactMethodInputSchema,
  updateContactMethodOutputSchema,
} from "@/lib/dto/contact-method";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { contactMethodService } from "@/services/domain/contact-method.service";

export const { POST, PATCH, DELETE } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createContactMethodInputSchema);
      const result = await contactMethodService.create(ctx, parsedData);

      const parsedResult = validateOutput(
        result,
        createContactMethodOutputSchema,
      );

      return NextResponse.json(parsedResult, { status: 201 });
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateContactMethodInputSchema);

      const result = await contactMethodService.update(ctx, parsedData);

      const parsedResult = validateOutput(
        result,
        updateContactMethodOutputSchema,
      );

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, deleteContactMethodsInputSchema);

      const result = await contactMethodService.delete(ctx, parsedData);

      const parsedResult = validateOutput(
        result,
        deleteContactMethodsOutputSchema,
      );

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
