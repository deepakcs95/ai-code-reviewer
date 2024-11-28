import { SignOutButton } from "@clerk/nextjs";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-red-300">
      <h1>Hello World</h1>
      <SignOutButton />
    </div>
  );
}
