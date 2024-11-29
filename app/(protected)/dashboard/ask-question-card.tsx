"use client";

import React, { useState } from "react";
import { useProject } from "../../../hooks/use-project.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Button } from "../../../components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog.tsx";
import { askQuestion } from "../../../server/router/question.ts";
import { readStreamableValue } from "ai/rsc";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filesReferenced, setFilesReferenced] = useState<
    { filename: string; summary: string; sourceCode: string }[]
  >([]);
  const [answer, setAnswer] = useState("");

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    setOpen(true);

    const { output, filesReferenced } = await askQuestion(question, project.id);

    setFilesReferenced(filesReferenced);

    for await (const chunk of readStreamableValue(output)) {
      if (chunk) {
        setAnswer((prev) => prev + chunk);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <img src="/logo.svg" alt="logo" className="w-10 h-10" />
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {answer}
            <div className="mt-4">
              <p className="font-semibold">Files referenced:</p>
              {filesReferenced.map((file) => (
                <div key={file.filename}>
                  <p>{file.filename}</p>
                </div>
              ))}
            </div>
          </DialogDescription>
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
            <Button className="mt-4" type="submit">
              Ask Question
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
