import { Octokit } from "octokit";
import db from "../lib/db.ts";
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const githuburl = "https://github.com/deepakcs20/image-comparator";

type response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (githubUrl: string): Promise<response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(3, 5);

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL");
  }
  const response = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });
  console.log(response.data);

  const sortedCommits = response.data.sort(
    (a, b) =>
      new Date(b.commit.author?.date || "").getTime() -
      new Date(a.commit.author?.date || "").getTime()
  );
  return sortedCommits.slice(0, 10).map((commit) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message || "",
    commitAuthorName: commit.commit.author?.name || "",
    commitAuthorAvatar: commit.author?.avatar_url || "",
    commitDate: commit.commit.author?.date || "",
  }));
};

const pollCommits = async (projectId: string) => {
  const { githubUrl } = (await fetchProjectGithubUrl(projectId)) as { githubUrl: string };
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
  return unprocessedCommits;
};

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });
  return { githubUrl: project?.githubUrl };
}

async function filterUnprocessedCommits(projectId: string, commitHashes: response[]) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit: any) => processedCommit.commitHash === commit.commitHash
      )
  );

  return unprocessedCommits;
}

console.log(await pollCommits("cm41jlhk0000i96iu1kelrxyq"));
