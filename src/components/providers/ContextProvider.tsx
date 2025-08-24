"use client";

import { createContext, useContext, useState } from "react";

interface GeneralContextType {
  isDeleting: boolean;
  setIsDeleting: (state: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (state: boolean) => void;
}

const GeneralContext = createContext<GeneralContextType | null>(null);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <GeneralContext.Provider
      value={{ isDeleting, setIsDeleting, isSidebarOpen, setIsSidebarOpen }}
    >
      {children}
    </GeneralContext.Provider>
  );
}

export function useDeleteState() {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error(
      "useDeleteState must be used within a DeleteContextProvider"
    );
  }
  return context;
}
