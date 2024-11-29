import { Header } from "../components/ui/header.tsx";
import { Button } from "../components/ui/button.tsx";
import React from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolutionize Your Code Reviews with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload your GitHub repo and get instant, intelligent code reviews. Ask anything
                  about your codebase and receive expert insights.
                </p>
              </div>
              <div className="w-full max-w-sm flex flex-col items-center space-y-2">
                <Button className="flex items-center" asChild>
                  <Link href="/create">
                    <GitHubLogoIcon className="mr-2 h-4 w-4" />
                    Get Started
                  </Link>
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 mt-16">
              <div className="flex flex-col items-center justify-center text-center space-y-2 border-gray-800 p-4 rounded-lg">
                <svg
                  className=" h-10 w-10 fill-current text-blue-500"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <h3 className="text-xl font-bold">AI-Powered Code Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Get in-depth code reviews and suggestions powered by advanced AI.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center space-y-2 border-gray-800 p-4 rounded-lg">
                <svg
                  className=" h-10 w-10 fill-current text-blue-500"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <h3 className="text-xl font-bold">Commit Summaries</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Get concise summaries of all commits in your repository.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center space-y-2 border-gray-800 p-4 rounded-lg">
                <svg
                  className=" h-10 w-10 fill-current text-blue-500"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" x2="12.01" y1="17" y2="17" />
                </svg>
                <h3 className="text-xl font-bold">Interactive Q&A</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Ask anything about your codebase and get instant, accurate answers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 CodeReviewAI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
