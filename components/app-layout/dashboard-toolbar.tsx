import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export function DashboardToolbar() {
  return (
    <header className="h-16 flex items-center shrink-0 gap-2 bg-secondary-background border-b-2 border-border">
      <div className="w-full flex items-center justify-between gap-2 px-4">
        <SidebarTrigger />
        <Button variant={"noShadow"} asChild>
          <Link href={"/"}>Exit Dashboard</Link>
        </Button>
      </div>
    </header>
  );
}
