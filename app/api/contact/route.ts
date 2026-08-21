import type { NextRequest } from "next/server";
import { ContactEmail } from "@/components/email-templates/contact-email";
import { LOCALE_HEADER } from "@/lib/constants";
import { sendContactEmailInputSchema } from "@/lib/dto/email";
import { languageCodeSchema } from "@/lib/dto/language-code";
import { handleApiErrors } from "@/lib/helpers/handle-api-errors";
import { resend } from "@/lib/helpers/resend";
import { validateInput } from "@/lib/helpers/validate-input";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = validateInput(body, sendContactEmailInputSchema);
    const locale = languageCodeSchema.parse(req.headers.get(LOCALE_HEADER));
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["mo.job3830@gmail.com"],
      replyTo: parsedBody.emailAddress,
      subject: parsedBody.subject,
      react: ContactEmail({
        fullName: parsedBody.fullName,
        content: parsedBody.content,
        email: parsedBody.emailAddress,
        locale,
      }),
    });
    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (error) {
    return handleApiErrors(error);
  }
}
