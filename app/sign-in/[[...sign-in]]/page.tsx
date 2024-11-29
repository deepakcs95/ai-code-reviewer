"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Header } from "../../../components/ui/header.tsx";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col justify-center p-8 bg-primary/5">
          <div className="max-w-md mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6  text-primary">Welcome to CodeReviewAI</h1>
            <p className="text-lg text-muted-foreground mb-6 ">
              Revolutionize your code reviews with AI-powered insights. Upload your GitHub repo and
              get instant, intelligent feedback.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-primary mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                AI-Powered Code Analysis
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-primary mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Commit Summaries
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-primary mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Interactive Q&A
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                  card: "shadow-none",
                  footer: "hidden",
                },
              }}
            />
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2024 CodeReviewAI. All rights reserved.
      </footer>
    </div>
  );
}
