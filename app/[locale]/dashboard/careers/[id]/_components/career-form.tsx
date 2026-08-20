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
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { Form } from "@/lib/helpers/form";
import { apiRoutes } from "@/lib/helpers/router";

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
      isFeatured: false,
    },
    resolver: zodResolver(createCareerInputSchema),
  });

  const updateForm = useForm<UpdateCareerInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      mode: initialValues?.mode ?? undefined,
      type: initialValues?.type ?? undefined,
      isPresent: initialValues?.isPresent,
      isFeatured: initialValues?.isFeatured,
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
      const res = await api(apiRoutes.careers.create, input, true);
      const data = (await res.json()) as CreateCareerOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Career was created successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateCareer } = useMutation({
    mutationKey: ["update-career"],
    mutationFn: async (input: UpdateCareerInputSchema) => {
      const res = await api(apiRoutes.careers.update, input, true);
      const data = (await res.json()) as UpdateCareerOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Career was updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
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
