"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type SendEmailInputSchema,
  sendEmailInputSchema,
} from "@/lib/dto/email";
import { Form } from "@/lib/helpers/form";

export function DirectMessageForm() {
  const i18n = useTranslations("contact.directMessage.form");
  const form = useForm<SendEmailInputSchema>({
    defaultValues: {
      fullName: "",
      emailAddress: "",
      content: "",
      subject: "",
    },
    resolver: zodResolver(sendEmailInputSchema),
  });
  const onSubmit = (values: SendEmailInputSchema) => {
    console.log({ values });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldGroup className="flex-row">
            <FormField
              name="fullName"
              label={i18n("fullName.label")}
              render={({ field }) => <Input {...field} />}
              control={form.control}
              description={i18n("fullName.description")}
            />
            <FormField
              name="emailAddress"
              label={i18n("email.label")}
              render={({ field }) => <Input {...field} />}
              control={form.control}
              description={i18n("email.description")}
            />
          </FieldGroup>
          <FormField
            name="subject"
            label={i18n("subject.label")}
            render={({ field }) => <Input {...field} />}
            control={form.control}
            description={i18n("subject.description")}
          />
          <FormField
            name="content"
            label={i18n("content.label")}
            render={({ field }) => <Input {...field} />}
            control={form.control}
            description={i18n("content.description")}
          />
          <Field orientation={"horizontal"}>
            <Button type="submit">Send a Message</Button>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
