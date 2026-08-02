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
import { Form } from "@/lib/helpers/form";

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
    },
    resolver: zodResolver(createContactMethodInputSchema),
  });

  const updateForm = useForm<UpdateContactMethodInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      url: initialValues?.url ?? "",
      copyableText: initialValues?.copyableText ?? "",
      translations: initialValues?.translations ?? [],
      assetIds: initialValues?.assets.map((asset) => asset.id) ?? [],
      featuredAssetId: initialValues?.featuredAsset?.id ?? undefined,
    },
    resolver: zodResolver(updateContactMethodInputSchema),
  });

  const { mutate: createContactMethod } = useMutation({
    mutationKey: ["create-contact-method"],
    mutationFn: async (input: CreateContactMethodInputSchema) => {
      const res = await fetch("/api/contact-methods", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as CreateContactMethodOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Contact method was created successfully");
      form.reset();
      router.refresh();
    },
    onError: () => {
      toast.success("Something went wrong while creating the contact method");
    },
  });

  const { mutate: updateContactMethod } = useMutation({
    mutationKey: ["update-contact-method"],
    mutationFn: async (input: UpdateContactMethodInputSchema) => {
      const res = await fetch("/api/contact-methods", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as UpdateContactMethodOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Contact method was updated successfully");
    },
    onError: () => {
      toast.success("Something went wrong while updating the contact method");
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
