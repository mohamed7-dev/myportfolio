import { type NextRequest, NextResponse } from "next/server";
import { deletionResponseSchema } from "@/lib/dto/common";
import { authorize } from "@/lib/helpers/authorize";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { z } from "@/lib/helpers/zod";
import { projectService } from "@/services/project.service";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await authorize();
  const { id } = await params;

  const parsedInput = validateInput(id, z.string());

  const result = await projectService().delete(parsedInput);

  const parsedResult = validateOutput(result, deletionResponseSchema);

  return NextResponse.json(parsedResult);
}
