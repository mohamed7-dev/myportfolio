"use client";

import { useEffect } from "react";
import { ErrorPage } from "@/components/page-layout/error-page";

type Props = {
  error: Error;
  reset(): void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPage reset={reset} />;
}
