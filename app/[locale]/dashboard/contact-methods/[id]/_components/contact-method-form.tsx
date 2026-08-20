"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type ContactMethod,
  type CreateContactMethodInputSchema,
  type CreateContactMethodOutputSchema,
  createContactMethodInputSchema,
  type UpdateContactMethodInputSchema,
  type UpdateContactMethodOutputSchema,
  updateContactMethodInputSchema,
} from "@/lib/dto/contact-method";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { Form } from "@/lib/helpers/form";
import { apiRoutes } from "@/lib/helpers/router";

export function ContactMethodForm({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: ContactMethod;
}) {
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;
  const router = useRouter();

  const form = useForm<CreateContactMethodInputSchema>({
    defaultValues: {
      url: "",
      copyableText: "",
      assetIds: [],
      featuredAssetId: undefined,
      translations: [],
      enabled: true,
      primary: false,
    },
    resolver: zodResolver(createContactMethodInputSchema),
  });

  const updateForm = useForm<UpdateContactMethodInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      url: initialValues?.url ?? "",
      enabled: initialValues?.enabled === false ? false : true,
      primary: initialValues?.primary === false ? false : true,
      copyableText: initialValues?.copyableText ?? "",
      translations: initialValues?.translations ?? [],
      assetIds: initialValues?.assets.map((asset) => asset.id) ?? undefined,
      featuredAssetId: initialValues?.featuredAsset?.id ?? undefined,
    },
    resolver: zodResolver(updateContactMethodInputSchema),
  });

  const { mutate: createContactMethod } = useMutation({
    mutationKey: ["create-contact-method"],
    mutationFn: async (input: CreateContactMethodInputSchema) => {
      const res = await api(apiRoutes.contactMethods.create, input, true);
      const data = (await res.json()) as CreateContactMethodOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Contact method was created successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateContactMethod } = useMutation({
    mutationKey: ["update-contact-method"],
    mutationFn: async (input: UpdateContactMethodInputSchema) => {
      const res = await api(apiRoutes.contactMethods.update, input, true);
      const data = (await res.json()) as UpdateContactMethodOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Contact method was updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (
    values: CreateContactMethodInputSchema | UpdateContactMethodInputSchema,
  ) => {
    if (creatingNewEntity) {
      createContactMethod({
        ...values,
      } as CreateContactMethodInputSchema);
    } else {
      updateContactMethod({
        ...values,
        id: params.id,
      } as UpdateContactMethodInputSchema);
    }
  };

  return (
    <Form {...((creatingNewEntity ? form : updateForm) as any)}>
      <form
        id="contact-method-form"
        onSubmit={(creatingNewEntity ? form : updateForm).handleSubmit(
          onSubmit,
        )}
      >
        {children}
      </form>
    </Form>
  );
}
