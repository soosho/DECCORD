"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Ensure theme updates correctly during hydration
    const appliedTheme = theme === "dark" || (theme === "system" && systemTheme === "dark") ? "dark" : "light";
    setCurrentTheme(appliedTheme);
  }, [theme, systemTheme]);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: currentTheme === "dark" ? dark : undefined, // Use undefined for light theme
      }}
    >
      {children}
    </ClerkProvider>
  );
}
