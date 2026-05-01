"use client";

import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useApp } from "./providers";

export default function ThemedShell({ children }: { children: ReactNode }) {
  const { theme } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hasSidebar = pathname === "/" || pathname?.startsWith("/search");

  const classes = [
    hasSidebar ? "grid-with-side" : "u-flex-vertical u-full-screen-height",
    theme === "dark" ? "theme-dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
