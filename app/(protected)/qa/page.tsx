"use client";

import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet.tsx";
import { useProject } from "../../../hooks/use-project.tsx";
import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "../../../server/actions/question.ts";
import AskQuestionCard from "../dashboard/ask-question-card.tsx";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references.tsx";

export default function Page() {
  const { projectId } = useProject();

  const { data, isLoading } = useQuery({
    queryKey: ["questions", projectId],
    queryFn: () => getQuestions(projectId),
  });

  if (!projectId) return <div>No project selected</div>;

  if (isLoading) return <div>Loading...</div>;

  const question = data?.[selectedQuestion];

  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-bold">Saved Questions</h1>
      <div className="flex flex-col gap-4 mt-4">
        {data?.map((question) => (
          <React.Fragment key={question.id}>
            <SheetTrigger>
              <div className="flex items-center gap-2 bg-white rounded-lg p-4 shadow border">
                <img
                  src={question.user.imageUrl}
                  alt={question.user.firstName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500 line-clamp-1 text-lg font-medium">
                      {question.question}
                    </p>
                    <span className="text-gray-500 text-sm whitespace-nowrap">
                      {question.createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-500 line-clamp-2 text-sm">{question.answer}</p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        ))}
      </div>
      {question && (
        <SheetContent className=" min-w-[80vw]">
          <SheetHeader>
            <SheetTitle>{question.question}</SheetTitle>
          </SheetHeader>
          <MDEditor.Markdown source={question.answer} />
          <CodeReferences filesReferences={question.filesReferences ?? []} />
        </SheetContent>
      )}
    </Sheet>
  );
}
