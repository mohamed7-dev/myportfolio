import React from "react";
import { AvatarDisplayDialog } from "./avatar-display-dialog";
import { Sidebar } from "./sidebar";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <div className="h-14 shrink-0 sm:h-20 lg:hidden" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-2 sm:px-4 lg:h-screen lg:min-h-0 lg:flex-row lg:gap-5 lg:overflow-hidden lg:px-12">
        <Sidebar />
        <main
          id="main-content"
          className="w-full flex-1 transition-all duration-300 lg:h-full lg:min-h-0 lg:w-4/5 lg:overflow-y-auto lg:pt-4 p-4 pt-0 sm:p-8 sm:pt-0 lg:pe-20 lg:ps-10"
        >
          {children}
        </main>
      </div>
      <AvatarDisplayDialog />
    </React.Fragment>
  );
}
