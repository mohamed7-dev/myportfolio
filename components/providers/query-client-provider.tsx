"use client";
import { QueryClientProvider as BaseQueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { queryClient } from "@/lib/helpers/query-client";

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  );
}
