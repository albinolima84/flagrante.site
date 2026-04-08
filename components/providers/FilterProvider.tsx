"use client";

import { useRef } from "react";
import { useFilterStore } from "@/lib/store";

// Zustand store is initialized lazily, but we need this client boundary
// to ensure the store is only accessed client-side.
export function FilterProvider({ children }: { children: React.ReactNode }) {
  // Eagerly initialize the store on first render to avoid hydration issues
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    // Store initializes itself via zustand create()
    void useFilterStore.getState;
  }
  return <>{children}</>;
}
