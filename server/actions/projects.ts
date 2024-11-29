"use server";

import { z } from "zod";
import { checkAuth } from "./protected.ts";
import db from "../../lib/db.ts";
import { pollCommits } from "../../lib/github.ts";
import { indexGithubRepo } from "../../lib/github-loader.ts";
import { checkCredits } from "../../lib/github-loader.ts";
import { getUserCredits } from "./credits.ts";
import { auth } from "@clerk/nextjs/server";

const projectSchema = z.object({
  repoUrl: z.string().min(1),
  projectName: z.string().min(1),
  githubToken: z.string().optional(),
});

export const checkForCredits = async (githubUrl: string, githubToken?: string) => {
  const fileCount = await checkCredits(githubUrl, githubToken);
  const userCredits = await getUserCredits();
  return { fileCount, userCredits: userCredits?.credits || 0 };
};

export const createProject = async (data: z.infer<typeof projectSchema>) => {
  console.log(data);

  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

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

  await pollCommits(project.id);
  await indexGithubRepo(project.id, project.githubUrl, project.githubToken || "");
  return { success: "Project created successfully" };
};

export const getAllProjects = async () => {
  console.log("getting all projects");
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const projects = await db.project.findMany({
    where: {
      userToProject: { some: { userId } },
    },
  });

  return projects;
};

export const deleteProject = async (projectId: string, userId: string) => {
  try {
    // Verify the association between the project and the user
    const userProject = await db.userProject.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });

    if (!userProject) {
      console.error("No association found between user and project");
      return { error: "Unauthorized or project not found" };
    }

    await db.project.delete({
      where: { id: projectId },
    });

    console.log("Project deleted successfully");
    return { success: "Project deleted successfully" };
  } catch (error) {
    console.error("Error deleting project", error);
    return { error: "Error deleting project" };
  }
};

export const getCommits = async (projectId: string) => {
  const commits = await db.commit.findMany({ where: { projectId } });
  return commits;
};
