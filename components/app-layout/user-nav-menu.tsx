"use client";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";
import { toast } from "sonner";
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
import type {
  AuthenticateAdminUserSuccessOutputSchema,
  LogoutOutputSchema,
} from "@/lib/dto/auth";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import {
  getUserInfoFromLS,
  removeUserInfoFromLS,
} from "@/lib/helpers/auth-storage";
import { apiRoutes } from "@/lib/helpers/router";
import { AppImage } from "../shared/app-image";
import { AccentSwitcher } from "./accent-switcher";
import { LanguageSwitcher } from "./language-switcher";

export function UserNavMenu() {
  const router = useRouter();
  const { isMobile, state } = useSidebar();
  const isSidebarExpanded = state === "expanded";
  const [userInfo, setUserInfo] = React.useState<
    AuthenticateAdminUserSuccessOutputSchema | undefined
  >();

  const handleLogout = async () => {
    await api(apiRoutes.auth.logoutAdmin, undefined, true)
      .then(async (res) => {
        const data = (await res.json()) as LogoutOutputSchema;
        if (isAppError(data)) {
          throw data;
        }
        if (data.success) {
          removeUserInfoFromLS();
          toast.success("Logged out successfully");
          router.refresh();
          router.replace("/login");
        } else {
          toast.error("Something went wrong while trying to logout");
        }
      })
      .catch((e) => {
        toast.error(`Failure: ${(e as Error).message}`);
      });
  };

  React.useEffect(() => {
    setUserInfo(getUserInfoFromLS());
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
              {userInfo?.featuredAsset && (
                <div className="flex justify-center items-center rounded-base border-2 border-border">
                  <AppImage
                    asset={userInfo?.featuredAsset}
                    transform={{ preset: "icon", mode: "resize" }}
                    className="size-8 object-cover"
                  />
                </div>
              )}
              {isSidebarExpanded && (
                <div className="flex flex-col text-sm leading-wide">
                  <span className="truncate font-base text-foreground">
                    {userInfo?.displayName ?? ""}
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
                  {userInfo?.featuredAsset && (
                    <div className="flex justify-center items-center rounded-base border-2 border-border">
                      <AppImage
                        asset={userInfo?.featuredAsset}
                        transform={{ preset: "icon", mode: "resize" }}
                        className="size-8 object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col text-sm leading-tight">
                    <span className="truncate font-base text-foreground">
                      {userInfo?.displayName ?? ""}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/about">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <AccentSwitcher mode="dashboard" />
            <Suspense>
              <LanguageSwitcher mode="dashboard" />
            </Suspense>
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
