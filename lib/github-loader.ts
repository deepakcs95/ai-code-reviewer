import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { summarizeCode, generateEmbedding } from "./gemini.ts";

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
  console.log("allEmbeddings", allEmbeddings);
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
