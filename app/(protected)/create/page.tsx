"use client";

import React from "react";
import { Form } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { FormField, FormItem, FormControl, FormMessage } from "../../../components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProject } from "../../../server/router/projects.ts";
import { toast } from "sonner";
import { useState } from "react";
import Spinner from "../../../components/ui/spinner.tsx";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const FormInputsSchema = z.object({
  repoUrl: z.string().min(1),
  projectName: z.string().min(1),
  githubToken: z.string().optional(),
});

const Page = () => {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
    const response = await createProject(data);
    console.log(response);
    if (response.error) {
      toast.error("Error creating project");
    } else {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }

    router.refresh();
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
