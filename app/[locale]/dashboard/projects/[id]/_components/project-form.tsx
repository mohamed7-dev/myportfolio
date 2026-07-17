"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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
      liveDemoUrl: initialValues?.liveDemoUrl ?? "",
      repoUrl: initialValues?.repoUrl ?? "",
      enabled: initialValues?.enabled ?? true,
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
    },
    onError: () => {
      toast.success("Something went wrong while creating the project");
    },
  });

  const { mutate: updateProject } = useMutation({
    mutationKey: ["update-project"],
    mutationFn: async (input) => {},
    onSuccess: () => {},
    onError: () => {},
  });

  const onSubmit = (
    values: CreateProjectInputSchema | UpdateProjectInputSchema,
  ) => {
    console.log(values);

    if (creatingNewEntity) {
      createProject({
        ...values,
        translations: values.translations.map((t) => ({
          ...t,
          slug: normalizeString(form.getValues("translations.0.name"), "-"),
        })) as any,
      });
    } else {
      console.log(values);
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
