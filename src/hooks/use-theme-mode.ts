// hooks/use-theme-mode.ts
"use client";

import { useTheme } from "next-themes";

export function useThemeMode() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return {
    isDarkMode,
    theme,
    getFilterButtonClass: (active: boolean = false) => {
      const baseClasses = "gap-2 border-border transition-colors";
      const conditionalClasses = active
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : isDarkMode
        ? "hover:bg-primary/10 hover:text-primary"
        : "bg-background hover:bg-accent hover:text-accent-foreground";

      return `${baseClasses} ${conditionalClasses}`;
    },
  };
}
