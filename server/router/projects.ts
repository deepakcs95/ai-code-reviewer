"use server";

import { z } from "zod";
import { checkAuth } from "./protected.ts";
import db from "@/lib/db";

const projectSchema = z.object({
  repoUrl: z.string().min(1),
  projectName: z.string().min(1),
  githubToken: z.string().optional(),
});

export const createProject = checkAuth(
  async (data: z.infer<typeof projectSchema>, userId: string) => {
    console.log(data);
    const parsedData = projectSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: parsedData.error.errors };
    }
    const project = await db.project.create({
      data: {
        githubUrl: parsedData.data.repoUrl,
        name: parsedData.data.projectName,
        githubToken: parsedData.data.githubToken,
        userToProject: {
          create: {
            userId: userId,
          },
        },
      },
    });

    return { success: "Project created successfully" };
  }
);
