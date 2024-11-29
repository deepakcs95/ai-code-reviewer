"use client";

import React, { useState, useEffect } from "react";
import { useProject } from "../../../hooks/use-project.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Button } from "../../../components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.tsx";
import { toast } from "sonner";
import { askQuestion } from "../../../server/router/question.ts";
import { readStreamableValue } from "ai/rsc";
import Spinner from "../../../components/ui/spinner.tsx";
import CodeReferences from "./code-references.tsx";
import MDEditor from "@uiw/react-md-editor";
import { saveQuestion } from "../../../server/router/question.ts";
import { useQueryClient } from "@tanstack/react-query";
// const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filesReferenced, setFilesReferenced] = useState<
    { filename: string; summary: string; sourceCode: string }[]
  >([]);
  const [answer, setAnswer] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) return;

    setLoading(true);
    setSaving(false);
    setAnswer("");
    setFilesReferenced([]);

    const { output, filesReferenced } = await askQuestion(question, project.id);

    setFilesReferenced(filesReferenced);
    setOpen(true);

    for await (const chunk of readStreamableValue(output)) {
      if (chunk) {
        setAnswer((prev) => prev + chunk);
      }
    }
    setLoading(false);
  };

  const handleSaveAnswer = async () => {
    if (!project?.id) return;
    setSaving(true);
    await saveQuestion(question, answer, filesReferenced, project.id);
    toast.success("Answer saved");
    queryClient.invalidateQueries({ queryKey: ["questions"] });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col  items-center justify-center">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="logo" className="w-10 h-10" />
                <Button disabled={saving} onClick={handleSaveAnswer} variant="outline">
                  {"Save Answer"}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <MDEditor.Markdown
            source={answer}
            className="  !h-full  max-h-[40vh] overflow-y-scroll p-2"
          />
          <div className="h-4"></div>
          <CodeReferences filesReferences={filesReferenced} />

          <Button
            variant="outline"
            className="mt-4 bg-primary text-white hover:bg-primary/80 w-full"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              className="w-full"
              placeholder="Ask a question about the code..."
              value={question}
              onChange={handleQuestionChange}
            />
            <Button
              disabled={loading}
              className="mt-4 bg-primary text-white hover:bg-primary/80"
              type="submit"
            >
              {loading ? <Spinner /> : "Ask Question"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
