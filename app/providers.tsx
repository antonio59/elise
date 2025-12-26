"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ConvexAuthProvider } from "@/lib/convex";

type Props = {
  children: ReactNode;
  initialToken?: string | null;
};

export default function Providers({ children, initialToken }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange
    >
      <ConvexAuthProvider initialToken={initialToken}>
        {children}
      </ConvexAuthProvider>
    </ThemeProvider>
  );
}
