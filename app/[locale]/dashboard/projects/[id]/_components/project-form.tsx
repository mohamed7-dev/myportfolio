"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type CreateProjectInputSchema,
  type CreateProjectOutputSchema,
  createProjectInputSchema,
  type FindOneProjectOutputSchema,
  type UpdateProjectInputSchema,
  type UpdateProjectOutputSchema,
  updateProjectInputSchema,
} from "@/lib/dto/project";
import { Form } from "@/lib/helpers/form";

export function ProjectForm({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: FindOneProjectOutputSchema;
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
      featured: false,
      translations: [],
      skillIds: [],
      achievementIds: [],
    },
    resolver: zodResolver(createProjectInputSchema),
  });

  const updateForm = useForm<UpdateProjectInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      assetIds:
        initialValues?.assets?.map((asset) => asset.asset.id) ?? undefined,
      featuredAssetId: initialValues?.featuredAsset?.id ?? "",
      liveDemoUrl: initialValues?.liveDemoUrl ?? "",
      repoUrl: initialValues?.repoUrl ?? "",
      enabled: initialValues?.enabled === false ? false : true,
      featured: initialValues?.featured === false ? false : true,
      finished: initialValues?.finished === false ? false : true,
      translations: initialValues?.translations ?? undefined,
      achievementIds:
        initialValues?.achievements?.map((a) => a.id) ?? undefined,
      skillIds: initialValues?.skills?.map((s) => s.id) ?? undefined,
      careerId: initialValues?.career?.id,
      educationItemId: initialValues?.education?.id,
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

      const data = (await res.json()) as CreateProjectOutputSchema;
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

      const data = (await res.json()) as UpdateProjectOutputSchema;
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
      } as CreateProjectInputSchema);
    } else {
      updateProject({
        ...values,
        id: params.id as string,
      } as UpdateProjectInputSchema);
    }
  };
  console.log(updateForm.formState.errors);

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
