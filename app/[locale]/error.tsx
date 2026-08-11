"use client";

import { useEffect } from "react";

type Props = {
  error: Error;
  reset(): void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <div>Error</div>;
}
