import { Code2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import { DashboardNavMenu } from "./dashboard-nav-menu";
import { UserNavMenu } from "./user-nav-menu";

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn("flex-row items-center", collapsed && "justify-center")}
      >
        <Code2Icon className="text-primary text-xl size-10" />
        {!collapsed && (
          <span className="text-foreground text-sm">My Portfolio</span>
        )}
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMenu />
      </SidebarContent>
      <SidebarFooter>
        <UserNavMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
