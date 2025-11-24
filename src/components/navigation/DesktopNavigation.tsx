import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  href: string;
  icon: any;
  label: string;
}

interface DesktopNavigationProps {
  navigationItems: NavigationItem[];
}

export function DesktopNavigation({ navigationItems }: DesktopNavigationProps) {
  return (
    <nav className="hidden lg:flex items-center space-x-2">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden xl:inline">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
