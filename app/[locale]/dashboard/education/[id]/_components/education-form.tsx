"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type CreateEducationInputSchema,
  type CreateEducationOutputSchema,
  createEducationInputSchema,
  type Education,
  type UpdateEducationInputSchema,
  type UpdateEducationOutputSchema,
  updateEducationInputSchema,
} from "@/lib/dto/education";
import { Form } from "@/lib/helpers/form";

export function EducationForm({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: Education;
}) {
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;
  const router = useRouter();

  const form = useForm<CreateEducationInputSchema>({
    defaultValues: {
      assetIds: [],
      translations: [],
      isPresent: false,
      startDate: undefined,
      endDate: undefined,
      gpa: undefined,
    },
    resolver: zodResolver(createEducationInputSchema),
  });

  const updateForm = useForm<UpdateEducationInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      isPresent: initialValues?.isPresent,
      startDate: initialValues?.startDate,
      endDate: initialValues?.endDate ?? undefined,
      gpa: initialValues?.gpa ?? undefined,
      translations: initialValues?.translations ?? [],
      assetIds: initialValues?.assets.map((asset) => asset.id) ?? [],
      featuredAssetId: initialValues?.featuredAsset?.id ?? "",
    },
    resolver: zodResolver(updateEducationInputSchema),
  });

  const { mutate: createEducation } = useMutation({
    mutationKey: ["create-education"],
    mutationFn: async (input: CreateEducationInputSchema) => {
      const res = await fetch("/api/education", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as CreateEducationOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Education item was created successfully");
      form.reset();
      router.refresh();
    },
    onError: () => {
      toast.success("Something went wrong while adding new education item");
    },
  });

  const { mutate: updateEducation } = useMutation({
    mutationKey: ["update-education"],
    mutationFn: async (input: UpdateEducationInputSchema) => {
      const res = await fetch("/api/education", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as UpdateEducationOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Education item was updated successfully");
    },
    onError: () => {
      toast.success("Something went wrong while updating education item");
    },
  });

  const onSubmit = (
    values: CreateEducationInputSchema | UpdateEducationInputSchema,
  ) => {
    if (creatingNewEntity) {
      createEducation({
        ...values,
      } as CreateEducationInputSchema);
    } else {
      updateEducation({
        ...values,
        id: params.id,
      } as UpdateEducationInputSchema);
    }
  };

  return (
    <Form {...((creatingNewEntity ? form : updateForm) as any)}>
      <form
        id="education-form"
        onSubmit={(creatingNewEntity ? form : updateForm).handleSubmit(
          onSubmit,
        )}
      >
        {children}
      </form>
    </Form>
  );
}
