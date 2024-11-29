"use client";

import React from "react";
import { useProject } from "../../../hooks/use-project.tsx";
import { useQuery } from "@tanstack/react-query";
import { getCommits } from "../../../server/actions/projects.ts";
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
  if (isLoading) return <Skeleton className="w-full h-20" />;

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">Error fetching commits</p>
      </div>
    );

  return (
    <ul className="space-y-6">
      {commits?.map((commit: Commit) => (
        <li key={commit.id} className="relative flex gap-x-4">
          <img
            src={commit.commitAuthorAvatar || "/user.svg"}
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
                  {commit.commitAuthorName}{" "}
                </span>
                <span className="inline-flex items-center gap-x-1 text-semibold text-gray-500">
                  commited
                  <ExternalLink />
                </span>
                <p className="text-xl text-black font-semibold">{commit.commitMessage}</p>
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
