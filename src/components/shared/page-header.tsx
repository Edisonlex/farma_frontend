"use client";

import type React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  count?: {
    filtered: number;
    total: number;
  };
}

export function PageHeader({ title, subtitle, icon, count }: PageHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary to-accent border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 dark:bg-black/10 p-3 rounded-lg backdrop-blur-sm border border-white/20 dark:border-white/10">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                {title}
              </h1>
              <p className="text-sm text-primary-foreground/80 mt-1 flex items-center">
                {count && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-foreground/20 text-primary-foreground mr-2">
                    {count.filtered} de {count.total}
                  </span>
                )}
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
