import Link from "next/link";
import { Button } from "./button.tsx";
import React from "react";

export function Header() {
  return (
    <header className="px-14 py-2 lg:px-36  h-14 shadow-sm  flex items-center">
      <Link href="/">
        <span className="font-bold text-2xl">CodeReviewAI</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
          Home
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
          Dashboard
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/billing">
          Pricing
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/qa">
          Q&A
        </Link>
      </nav>
      <div className="ml-4 flex gap-2">
        <Button variant="ghost" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </header>
  );
}
