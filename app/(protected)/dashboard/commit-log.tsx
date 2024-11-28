"use client";

import React from "react";
import { useProject } from "../../../hooks/use-project.tsx";
import { useQuery } from "@tanstack/react-query";
import { getCommits } from "../../../server/router/projects.ts";
import Skeleton from "../../../components/ui/skeleton.tsx";

import { Commit } from "@prisma/client";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
export default function CommitLog() {
  const { project, projectId } = useProject();

  const {
    data: commits,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["commits", projectId],
    queryFn: () => getCommits(projectId),
    enabled: !!projectId,
  });

  //

  return (
    <ul className="space-y-6">
      {commits?.map((commit: Commit) => (
        <li key={commit.id} className="relative flex gap-x-4">
          <img
            src={commit.commitAuthorAvatar}
            alt={commit.commitAuthorName}
            className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
          />
          <div className="flex-auto rounded-md   ring-1 ring-inset ring-gray-900/5">
            <div className="flex items-center gap-x-3">
              <Link.default
                target="_blank"
                href={`${project?.githubUrl}/commit/${commit.commitHash}`}
              >
                <span className="text-sm font-medium leading-6 text-gray-900">
                  {commit.commitMessage}{" "}
                </span>
                <span className="inline-flex items-center gap-x-1 text-semibold text-gray-500">
                  commited
                  <ExternalLink />
                </span>
                <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                  {commit.summary}
                </pre>
              </Link.default>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
