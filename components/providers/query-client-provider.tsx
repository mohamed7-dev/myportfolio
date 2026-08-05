"use client";
import { QueryClientProvider as BaseQueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { getQueryClient } from "@/lib/helpers/query-client";

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseQueryClientProvider client={getQueryClient()}>
      {children}
    </BaseQueryClientProvider>
  );
}
