import { z } from "@/lib/helpers/zod";

export const sendEmailInputSchema = z.object({
  fullName: z.string().nonempty(),
  emailAddress: z.string().nonempty(),
  subject: z.string().nonempty(),
  content: z.string().nonempty(),
});

export type SendEmailInputSchema = z.infer<typeof sendEmailInputSchema>;
