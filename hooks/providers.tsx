"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PayPalScriptProvider>
  );
}
