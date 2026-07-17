import { SidebarTrigger } from "../ui/sidebar";

export function DashboardToolbar() {
  return (
    <header className="h-16 flex items-center shrink-0 gap-2 bg-secondary-background border-b-2 border-border">
      <div className="w-full flex items-center justify-between gap-2 px-4">
        <div className="flex items-center justify-start gap-2 min-w-0">
          <SidebarTrigger />
        </div>
      </div>
    </header>
  );
}
