import {
  BrainIcon,
  BriefcaseIcon,
  Code2Icon,
  ContactIcon,
  GraduationCapIcon,
  ImageIcon,
  TrophyIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

const sidebarItems = [
  {
    id: "about",
    title: "About",
    icon: UserIcon,
    path: "about",
  },
  {
    id: "projects",
    title: "Project",
    icon: Code2Icon,
    path: "projects",
  },
  {
    id: "assets",
    title: "Asset",
    icon: ImageIcon,
    path: "assets",
  },
  {
    id: "skills",
    title: "Skill",
    icon: BrainIcon,
    path: "skills",
  },
  {
    id: "careers",
    title: "Career",
    icon: BriefcaseIcon,
    path: "careers",
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCapIcon,
    path: "education",
  },
  {
    id: "achievements",
    title: "Achievement",
    icon: TrophyIcon,
    path: "achievements",
  },
  {
    id: "contactMethods",
    title: "Contact Method",
    icon: ContactIcon,
    path: "contact-methods",
  },
];

export function DashboardNavMenu() {
  const pathname = usePathname();

  const normalizePath = (path: string) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const withoutLocale = cleanPath.replace(
      /^\/[a-z]{2}(?:-[a-z]{2})?(?=\/)/i,
      "",
    );

    return withoutLocale === "" ? "/" : withoutLocale;
  };

  const isActive = (itemUrl: string) => {
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(itemUrl);

    if (targetPath === "/") {
      return currentPath === "/";
    }

    return (
      currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
    );
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {sidebarItems.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              isActive={isActive(`/dashboard/${item.path}`)}
              asChild
            >
              <Link href={`/dashboard/${item.path}`}>
                <item.icon />
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
