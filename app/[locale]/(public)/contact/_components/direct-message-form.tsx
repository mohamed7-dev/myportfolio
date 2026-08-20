"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type SendContactEmailInputSchema,
  type SendContactEmailOutputSchema,
  sendContactEmailInputSchema,
} from "@/lib/dto/email";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { Form } from "@/lib/helpers/form";
import { apiRoutes } from "@/lib/helpers/router";

export function DirectMessageForm() {
  const i18n = useTranslations("contact.directMessage.form");
  const form = useForm<SendContactEmailInputSchema>({
    defaultValues: {
      fullName: "",
      emailAddress: "",
      content: "",
      subject: "",
    },
    resolver: zodResolver(sendContactEmailInputSchema),
  });
  const [isPending, startTransition] = React.useTransition();

  const onSubmit = async (values: SendContactEmailInputSchema) => {
    startTransition(async () => {
      const res = await api(apiRoutes.contact.sendEmail, values, false);

      const data = (await res.json()) as SendContactEmailOutputSchema;

      if (isAppError(data)) {
        toast.error(i18n("submit.emailError"));
      } else {
        toast.success(i18n("submit.emailSuccess"));
      }
    });
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
            <Button type="submit" disabled={isPending}>
              {i18n("submit.label")}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
