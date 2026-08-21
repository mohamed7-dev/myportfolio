"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type AuthenticateAdminUserInputSchema,
  type AuthenticateAdminUserOutputSchema,
  authenticateAdminUserInputSchema,
} from "@/lib/dto/auth";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { setUserInfoToLS } from "@/lib/helpers/auth-storage";
import { Form } from "@/lib/helpers/form";
import { apiRoutes } from "@/lib/helpers/router";
import { FormField } from "../shared/form-field";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";

export function LoginForm() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const form = useForm<AuthenticateAdminUserInputSchema>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(authenticateAdminUserInputSchema),
  });

  const onSubmit = async (values: AuthenticateAdminUserInputSchema) => {
    setIsVerifying(true);
    await api(apiRoutes.auth.authenticateAdmin, values, false)
      .then(async (result) => {
        const data = (await result.json()) as AuthenticateAdminUserOutputSchema;
        if (isAppError(data)) {
          throw data;
        }
        setUserInfoToLS(data);
        toast.success("Authenticated successfully");
        router.replace("/dashboard");
      })
      .catch((e) => {
        toast.error(`Failure: ${(e as Error).message}`);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Portfolio / <span className="text-primary">Admin Portal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormField
                control={form.control}
                name="username"
                label="User Name"
                render={({ field }) => <Input {...field} />}
              />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                render={({ field }) => <Input {...field} type="password" />}
              />
            </FieldGroup>
          </form>
        </Form>
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
