import { NextResponse } from "next/server";
import { getAllProjects } from "../../../server/router/projects.ts";

export async function GET() {
  const projects = await getAllProjects({});
  return NextResponse.json(projects);
}
