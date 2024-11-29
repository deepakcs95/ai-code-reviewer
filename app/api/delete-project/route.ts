import { NextResponse } from "next/server";
import { deleteProject } from "../../../server/actions/projects.ts";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  const { projectId } = await request.json();
  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" });
  }
  try {
    await deleteProject(projectId, userId);
    revalidatePath("/");
    return NextResponse.json({ success: "Project deleted successfully" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Failed to delete project" });
  }
}
