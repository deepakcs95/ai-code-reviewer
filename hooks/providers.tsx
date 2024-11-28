"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  //@ts-ignore
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
