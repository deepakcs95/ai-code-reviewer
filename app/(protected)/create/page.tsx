"use client";

import React from "react";
import { Form } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { FormField, FormItem, FormControl, FormMessage } from "../../../components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info } from "lucide-react";
import { createProject } from "../../../server/actions/projects.ts";
import { toast } from "sonner";
import { useState } from "react";
import Spinner from "../../../components/ui/spinner.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { checkForCredits } from "../../../server/actions/projects.ts";
import { useRouter } from "next/navigation";
const FormInputsSchema = z.object({
  repoUrl: z.string().min(1),
  projectName: z.string().min(1),
  githubToken: z.string().optional(),
});

const Page = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [fileCount, setFileCount] = useState<number | null>(null);

  const form = useForm<z.infer<typeof FormInputsSchema>>({
    resolver: zodResolver(FormInputsSchema),
    defaultValues: {
      repoUrl: "",
      projectName: "",
      githubToken: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setLoading(true);

    const { fileCount, userCredits } = await checkForCredits(data.repoUrl, data.githubToken);
    setCredits(userCredits);
    setFileCount(fileCount);
    if (userCredits < fileCount) {
      toast.error("Not enough credits to create the project");
      router.push("/billing");
      setLoading(false);
      return;
    }
    const response = await createProject(data);
    console.log(response);
    if (response.error) {
      toast.error("Error creating project");
    } else {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
    setLoading(false);
  });

  return (
    <div className="flex  h-full gap-10 justify-center items-center">
      <img src="/create.svg" alt="logo" width={150} height={150} />
      <div>
        <div className="flex flex-col gap-2 items-center text-center">
          <h1 className="text-2xl font-bold">Create Project</h1>
          <p className="text-sm text-muted-foreground">
            Create a new project to start reviewing code
          </p>
          <div>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-2 max-w-3xl mx-auto py-4">
                <FormField
                  control={form.control}
                  name="repoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/ProjectName"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Project Name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Optional" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Credits credits={credits} fileCount={fileCount} />

                <Button disabled={loading} type="submit" className="w-20">
                  {loading ? <Spinner /> : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

const Credits = ({ credits, fileCount }: { credits: number | null; fileCount: number | null }) => {
  if (!credits || !fileCount) return null;

  return (
    <div className="flex my-4 flex-col gap-2 bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4" />
        <p className="text-sm">
          You have {credits} credits remaining. It takes {fileCount} credits to index the files in
          the repository.
        </p>
      </div>
    </div>
  );
};
