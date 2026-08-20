"use client";
import { ErrorPage } from "@/components/page-layout/error-page";

export default function DashboardErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage reset={reset} />;
}
