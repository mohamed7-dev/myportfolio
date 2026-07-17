"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth", { method: "put", credentials: "include" }).then(
      async (res) => {
        const data = await res.json();
        console.log(data);
        if (data.success) {
          router.replace("/login");
        } else {
          // show sonner
        }
      },
    );
  };
  return <Button onClick={handleLogout}>Logout</Button>;
}
