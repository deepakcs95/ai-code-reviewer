"use client";

import React from "react";
import { useProject } from "../../../hooks/use-project.tsx";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import CommitLog from "./commit-log.tsx";
import AskQuestionCard from "./ask-question-card.tsx";
import InviteMembers from "./invite-members.tsx";
export default function Page() {
  const { project } = useProject();

  if (!project)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">No project found</p>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        {/* github link */}
        <div className="w-fit rounded-md bg-primary px-4 py-3 flex items-center">
          <Github className="text-white size-6" />
          <div className="ml-2  ">
            <p className=" text-sm text-white font-medium">
              This project is linked to{" "}
              <Link.default
                href={project?.githubUrl ?? ""}
                className="inline-flex items-center gap-1 text-white font-medium hover:underline cursor-pointer"
              >
                {project?.githubUrl}
                <ExternalLink className="ml-1 size-4" />
              </Link.default>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <InviteMembers />
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-4">
          <CommitLog />
        </div>
      </div>
    </div>
  );
}
