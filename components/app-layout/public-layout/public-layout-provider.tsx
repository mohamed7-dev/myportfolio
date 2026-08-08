"use client";
import React from "react";
import type { GetSuperAdminProfileOutputSchema } from "@/lib/dto/visitor";
import { createContext } from "@/lib/helpers/create-context";

interface PublicLayoutContextValue {
  profile: GetSuperAdminProfileOutputSchema;
  isAvatarOpen: boolean;
  openAvatar: () => void;
  closeAvatar: () => void;
}

const [PublicLayoutContextProvider, usePublicLayout] =
  createContext<PublicLayoutContextValue>("PublicLayout", undefined);

export function PublicLayoutProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: GetSuperAdminProfileOutputSchema;
}) {
  const [isAvatarOpen, setIsAvatarOpen] = React.useState(false);
  const openAvatar = React.useCallback(() => setIsAvatarOpen(true), []);
  const closeAvatar = React.useCallback(() => setIsAvatarOpen(false), []);

  const value = React.useMemo(() => {
    return {
      profile,
      isAvatarOpen,
      openAvatar,
      closeAvatar,
    };
  }, [profile, isAvatarOpen, openAvatar, closeAvatar]);

  return (
    <PublicLayoutContextProvider {...value}>
      {children}
    </PublicLayoutContextProvider>
  );
}

export { usePublicLayout };
