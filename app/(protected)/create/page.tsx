"use client";

import React from "react";
import Image from "next/image";
import { Form } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { FormField, FormItem, FormControl, FormMessage } from "../../../components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormInputsSchema = z.object({
  repoUrl: z.string().url(),
  projectName: z.string().min(1),
  githubToken: z.string().optional(),
});

const onSubmit = (data: z.infer<typeof FormInputsSchema>) => {
  console.log(data);
};

const Page = () => {
  const form = useForm<z.infer<typeof FormInputsSchema>>({
    resolver: zodResolver(FormInputsSchema),
    defaultValues: {
      repoUrl: "",
      projectName: "",
      githubToken: "",
    },
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 max-w-3xl mx-auto py-4"
              >
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
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
