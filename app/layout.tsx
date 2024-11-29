import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Providers from "../hooks/providers.tsx";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeReviewAI - Your Intelligent Code Review Assistant",
  description: "Upload your GitHub repo and get AI-powered code reviews and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            {children}

            <Toaster richColors />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
