// components/ui/filter-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface FilterButtonProps {
  variant?:
    | "default"
    | "ghost"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
  icon?: React.ReactNode;
}

export function FilterButton({
  variant = "ghost",
  size = "sm",
  children,
  onClick,
  className,
  active = false,
  icon,
}: FilterButtonProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Clases base para el botón
  const baseClasses = "gap-2 border-border transition-colors";

  // Clases condicionales basadas en el modo y estado activo
  const conditionalClasses = active
    ? "bg-primary text-primary-foreground hover:bg-primary/90"
    : isDarkMode
    ? "hover:bg-primary/10 hover:text-primary"
    : "bg-background hover:bg-accent hover:text-accent-foreground";

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(baseClasses, conditionalClasses, className)}
      onClick={onClick}
    >
      {icon}
      {children}
    </Button>
  );
}
