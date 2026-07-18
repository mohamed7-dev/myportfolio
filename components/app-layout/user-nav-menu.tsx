"use client";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AccentSwitcher } from "./accent-switcher";

export function UserNavMenu() {
  const router = useRouter();
  const { isMobile, state } = useSidebar();
  const isSidebarExpanded = state === "expanded";

  // TODO: read user data from the server
  const user = {
    firstName: "mohamed",
    lastName: "shaban",
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "put", credentials: "include" }).then(
      async (res) => {
        const data = await res.json();
        console.log(data);
        if (data.success) {
          router.refresh();
          router.replace("/login");
        } else {
          // show sonner
        }
      },
    );
  };

  const avatar = React.useMemo(() => {
    return (user.firstName?.charAt(0) ?? "") + (user.lastName?.charAt(0) ?? "");
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size={"lg"}
              className="data-open:bg-primary data-open:text-primary-foreground"
            >
              <div className="size-8 relative flex justify-center items-center rounded-base border-2 border-border">
                {avatar}
              </div>
              {isSidebarExpanded && (
                <div className="flex flex-col text-sm leading-wide">
                  <span className="truncate font-base text-foreground">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={7}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="size-8 relative flex justify-center items-center rounded-base border-2 border-border">
                    {avatar}
                  </div>
                  <div className="flex flex-col text-sm leading-tight">
                    <span className="truncate font-base text-foreground">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <AccentSwitcher />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/about">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
