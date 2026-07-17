import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button asChild>
        <Link href={"/dashboard"}>Go to dashboard</Link>
      </Button>
    </div>
  );
}
