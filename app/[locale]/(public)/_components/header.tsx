"use client";
import { DownloadIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/client";

// export function HomePageHeader() {
//   const i18n = useI18n();
//   const ctx = usePublicLayout("HomePageHeader");
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between gap-4">
//         <h1 className="text-3xl font-heading leading-tight capitalize">
//           {ctx.profile.intro}
//         </h1>
//         <Button asChild>
//           <a href={"http://localhost:3000"} target="_blank" rel="noreferrer">
//             <DownloadIcon className="size-4" />
//             <span className="hidden sm:inline">{i18n("cv")}</span>
//             <span className="sm:hidden">CV</span>
//           </a>
//         </Button>
//       </div>
//       <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground capitalize">
//         <span>•</span>
//         <span>{ctx.profile.jobTitle}</span>
//         <span className="flex items-center gap-1.5">
//           <MapPinIcon className="size-4" />
//           {i18n("location", { location: ctx.profile.location })}
//         </span>
//       </div>
//       <p className="max-w-181 text-base leading-6 text-foreground">
//         {ctx.profile.subHeading}
//       </p>
//     </div>
//   );
// }

export function HomePageHeader({ children }: { children: React.ReactNode }) {
  const ctx = usePublicLayout("HomePageHeader");

  return (
    <Card>
      <CardContent>
        <div
          className="h-48 w-full bg-surface-variant relative"
          data-alt="A striking abstract architectural background with subtle glowing geometric lines, dark modern light-mode aesthetic, deep charcoal base with soft, diffused white lighting accents, perfect for a high-end technical portfolio cover."
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALBep1MV3pW1Z3MdrRm3xSIqCDIeyfE19nVKirSoumv7M0RJjAMxxLfN5xx-e-97ZrGwy03uy0AOiAp2KFHNgVbXFSFjScxQeDNtBZCwtxIwD9EqG3KFl2Rm5ZqKK6bpqBoGcWTUNV_kugC2rG0hQoVQcYEquK3fLHqJH9VwlVPdytvyMbnja-4IelpjJI9KCe0E0QrzWr65YIE6Q3mF_3o1B8X_upT2rodKCSk1XqUHIubKrulrv4')",
          }}
        ></div>
        <div className="px-8 flex justify-between items-end relative -mt-16 z-10">
          <div className="p-1 bg-secondary-background rounded-full">
            {ctx.profile.avatar && (
              <Image
                src={ctx.profile.avatar?.previewIdentifier}
                alt={ctx.profile.displayName}
                width={ctx.profile.avatar.width}
                height={ctx.profile.avatar.height}
                className="size-32 rounded-full object-cover"
              />
            )}
          </div>
          <div className="mb-4 flex gap-3">
            <Button>Connect</Button>
            <Button variant={"neutral"}>Message</Button>
          </div>
        </div>
        <div className="px-8 mt-4">
          <h1 className="text-2xl font-heading text-foreground">
            {ctx.profile.intro}
          </h1>
          <p className="text-base font-base text-foreground/80 mt-1">
            {ctx.profile.jobTitle}
          </p>
          <p className="text-sm font-base text-foreground mt-4 max-w-2xl">
            {ctx.profile.subHeading}
          </p>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
