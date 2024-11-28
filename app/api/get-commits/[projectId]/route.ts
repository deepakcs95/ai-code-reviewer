import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "../../../../lib/db.ts";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const projectId = (await params).projectId;

  const commits = await db.commit.findMany({ where: { projectId } });

  return NextResponse.json(commits);
}
