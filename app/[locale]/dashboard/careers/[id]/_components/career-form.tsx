"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type Career,
  type CreateCareerInputSchema,
  type CreateCareerOutputSchema,
  createCareerInputSchema,
  type UpdateCareerInputSchema,
  type UpdateCareerOutputSchema,
  updateCareerInputSchema,
} from "@/lib/dto/career";
import { Form } from "@/lib/helpers/form";

export function CareerForm({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: Career;
}) {
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;
  const router = useRouter();

  const form = useForm<CreateCareerInputSchema>({
    defaultValues: {
      assetIds: [],
      translations: [],
      isPresent: false,
      startDate: undefined,
      endDate: undefined,
    },
    resolver: zodResolver(createCareerInputSchema),
  });

  const updateForm = useForm<UpdateCareerInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      mode: initialValues?.mode ?? undefined,
      type: initialValues?.type ?? undefined,
      isPresent: initialValues?.isPresent,
      startDate: initialValues?.startDate,
      endDate: initialValues?.endDate ?? undefined,
      translations: initialValues?.translations ?? [],
      assetIds: initialValues?.assets.map((asset) => asset.id) ?? [],
      featuredAssetId: initialValues?.featuredAsset?.id ?? "",
    },
    resolver: zodResolver(updateCareerInputSchema),
  });

  const { mutate: createCareer } = useMutation({
    mutationKey: ["create-career"],
    mutationFn: async (input: CreateCareerInputSchema) => {
      const res = await fetch("/api/careers", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as CreateCareerOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Career was created successfully");
      form.reset();
      router.refresh();
    },
    onError: () => {
      toast.success("Something went wrong while creating the career");
    },
  });

  const { mutate: updateCareer } = useMutation({
    mutationKey: ["update-career"],
    mutationFn: async (input: UpdateCareerInputSchema) => {
      const res = await fetch("/api/careers", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as UpdateCareerOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Career was updated successfully");
    },
    onError: () => {
      toast.success("Something went wrong while updating the career");
    },
  });

  const onSubmit = (
    values: CreateCareerInputSchema | UpdateCareerInputSchema,
  ) => {
    if (creatingNewEntity) {
      createCareer({
        ...values,
      } as CreateCareerInputSchema);
    } else {
      updateCareer({
        ...values,
        id: params.id,
      } as UpdateCareerInputSchema);
    }
  };

  return (
    <Form {...((creatingNewEntity ? form : updateForm) as any)}>
      <form
        id="career-form"
        onSubmit={(creatingNewEntity ? form : updateForm).handleSubmit(
          onSubmit,
        )}
      >
        {children}
      </form>
    </Form>
  );
}
