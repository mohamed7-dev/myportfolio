import type { CreateEmailResponseSuccess } from "resend";
import { z } from "@/lib/helpers/zod";
import type { ApiErrorSchema } from "./common";

export const sendContactEmailInputSchema = z.object({
  fullName: z.string().nonempty(),
  emailAddress: z.string().nonempty(),
  subject: z.string().nonempty(),
  content: z.string().nonempty(),
});

export type SendContactEmailInputSchema = z.infer<
  typeof sendContactEmailInputSchema
>;

export type SendContactEmailOutputSchema =
  | CreateEmailResponseSuccess
  | ApiErrorSchema;
