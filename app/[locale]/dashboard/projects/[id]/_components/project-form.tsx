"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type CreateProjectInputSchema,
  createProjectInputSchema,
  type Project,
  type UpdateProjectInputSchema,
  updateProjectInputSchema,
} from "@/lib/dto/project";
import { Form } from "@/lib/helpers/form";
import { normalizeString } from "@/lib/utils/normalize-string";

export function ProjectForm({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: Project;
}) {
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;
  const router = useRouter();

  const form = useForm<CreateProjectInputSchema>({
    defaultValues: {
      assetIds: [],
      liveDemoUrl: "",
      repoUrl: "",
      enabled: true,
      translations: [],
    },
    resolver: zodResolver(createProjectInputSchema),
  });

  const updateForm = useForm<UpdateProjectInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      assetIds: initialValues?.assets?.map((asset) => asset.asset.id) ?? [],
      featuredAssetId: initialValues?.featuredAsset?.id ?? "",
      liveDemoUrl: initialValues?.liveDemoUrl ?? "",
      repoUrl: initialValues?.repoUrl ?? "",
      enabled: initialValues?.enabled === false ? false : true,
      translations: initialValues?.translations ?? [],
    },
    resolver: zodResolver(updateProjectInputSchema),
  });

  const { mutate: createProject } = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async (input: CreateProjectInputSchema) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as Project;
      return data;
    },
    onSuccess: () => {
      toast.success("Project was created successfully");
      form.reset();
      router.refresh();
    },
    onError: () => {
      toast.success("Something went wrong while creating the project");
    },
  });

  const { mutate: updateProject } = useMutation({
    mutationKey: ["update-project"],
    mutationFn: async (input: UpdateProjectInputSchema) => {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as Project;
      return data;
    },
    onSuccess: () => {
      toast.success("Project was updated successfully");
    },
    onError: () => {
      toast.success("Something went wrong while updating the project");
    },
  });

  const onSubmit = (
    values: CreateProjectInputSchema | UpdateProjectInputSchema,
  ) => {
    if (creatingNewEntity) {
      createProject({
        ...values,
        translations: values.translations.map((t) => ({
          ...t,
          slug: normalizeString(form.getValues("translations.0.name"), "-"),
        })) as any,
      });
    } else {
      updateProject({
        ...values,
        id: params.id as string,
        translations: values.translations.map((t) => ({
          ...t,
          slug: normalizeString(form.getValues("translations.0.name"), "-"),
        })) as any,
      });
    }
  };

  return (
    <Form {...((creatingNewEntity ? form : updateForm) as any)}>
      <form
        id="project-form"
        onSubmit={(creatingNewEntity ? form : updateForm).handleSubmit(
          onSubmit,
        )}
      >
        {children}
      </form>
    </Form>
  );
}
