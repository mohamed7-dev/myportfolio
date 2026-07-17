import { type NextRequest, NextResponse } from "next/server";
import { paginatedListInputSchema } from "@/lib/dto/paginated-list";
import {
  createProjectInputSchema,
  projectListOutputSchema,
} from "@/lib/dto/project";
import { authorize } from "@/lib/helpers/authorize";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { projectService } from "@/services/project.service";

export async function POST(req: NextRequest) {
  await authorize();

  const body = await req.json();

  const parsedData = validateInput(body, createProjectInputSchema);

  const result = await projectService().create(parsedData);

  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  await authorize();

  const parsedSearchParams = validateInput(
    Object.fromEntries(req.nextUrl.searchParams.entries()),
    paginatedListInputSchema,
  );

  const result = await projectService().projects(parsedSearchParams);

  const parsedData = validateOutput(result, projectListOutputSchema);

  return NextResponse.json({
    items: parsedData.items,
    itemsCount: parsedData.itemsCount,
  });
}
