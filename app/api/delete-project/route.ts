import { NextResponse } from "next/server";
import { deleteProject } from "../../../server/router/projects.ts";
import { auth } from "@clerk/nextjs/server";

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
    return NextResponse.json({ success: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" });
  }
}
