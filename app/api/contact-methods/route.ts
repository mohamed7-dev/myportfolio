import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import { cacheKeys } from "@/lib/constants";
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

      revalidatePath("/contact", "page");
      revalidateTag(cacheKeys.publicContactMethods[0], "max");

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

      revalidatePath("/contact", "page");
      revalidateTag(cacheKeys.publicContactMethods[0], "max");
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

      revalidatePath("/contact", "page");
      revalidateTag(cacheKeys.publicContactMethods[0], "max");

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
