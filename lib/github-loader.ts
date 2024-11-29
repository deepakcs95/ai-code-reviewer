import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { summarizeCode, generateEmbedding } from "./gemini.ts";
import db from "./db.ts";
import { Octokit } from "octokit";

const fileCount = async (
  path: string,
  octokit: Octokit,
  githubOwner: string,
  githubRepo: string,
  accumulator: number
) => {
  const { data } = await octokit.rest.repos.getContent({
    owner: githubOwner,
    repo: githubRepo,
    path,
  });

  if (!Array.isArray(data) && data.type === "file") {
    return accumulator + 1;
  }

  if (Array.isArray(data)) {
    let totalFiles = 0;
    const directories: string[] = [];

    for (const file of data) {
      if (file.type === "dir") {
        directories.push(file.path);
      } else if (file.type === "file") {
        totalFiles += 1;
      }
    }

    if (directories.length > 0) {
      const directoryCounts = await Promise.all(
        directories.map((dir) => fileCount(dir, octokit, githubOwner, githubRepo, 0))
      );

      totalFiles += directoryCounts.reduce((acc, count) => acc + count, 0);
    }

    return accumulator + totalFiles;
  }

  return accumulator;
};

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
  const octokit = new Octokit({
    auth: githubToken,
  });
  const githubOwner = githubUrl.split("/")[3];
  const githubRepo = githubUrl.split("/")[4];

  if (!githubOwner || !githubRepo) {
    return 0;
  }

  const filecount = await fileCount("", octokit, githubOwner, githubRepo, 0);

  return filecount;
};

export const githubLoader = async (githubUrl: string, githubToken?: string) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "master",
    ignoreFiles: ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  const docs = await loader.load();

  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string
) => {
  const docs = await githubLoader(githubUrl, githubToken);

  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      console.log("processing embedding", index, allEmbeddings.length);
      if (!embedding.summary) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbeddings.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          filename: embedding.fileName,
          projectId,
        },
      });

      await db.$executeRaw`
      UPDATE "SourceCodeEmbeddings"
      SET "summaryEmbedding" = ${embedding.embedding}::vector
      WHERE "id" = ${sourceCodeEmbedding.id}
      `;
    })
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = await summarizeCode(doc);
      const embedding = await generateEmbedding(summary);

      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    })
  );
};
