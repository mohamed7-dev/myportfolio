import { Loader2Icon } from "lucide-react";

export function DynamicLoader({ label }: { label?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <Loader2Icon className="size-10 animate-spin" />
      {label && label}
    </div>
  );
}
