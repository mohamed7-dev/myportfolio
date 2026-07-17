"use client";
import { useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import z from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginSchema = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onFormSubmit(value);
    },
  });

  const onFormSubmit = async (value: LoginSchema) => {
    setIsVerifying(true);
    await fetch("/api/auth", {
      method: "post",
      body: JSON.stringify(value),
      credentials: "include",
    })
      .then(async (result) => {
        const data = (await result.json()) as { username: string };
        if (data.username) {
          // show sonner
          // localStorage.setItem("profile", JSON.stringify(result));
          router.replace("/dashboard");
        }
      })
      .catch((e) => {
        // show sonner
        console.log(e);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  };

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Portfolio / <span className="text-primary">Admin Portal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={onSubmit}>
          <FieldGroup>
            <form.Field
              name="username"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>User Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder={"User name"}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder={"Password"}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation={"horizontal"}>
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={isVerifying}
            size={"lg"}
          >
            {isVerifying && (
              <>
                <Loader2Icon className="animate-spin" />
                Please wait
              </>
            )}
            {!isVerifying && "Sign in"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
