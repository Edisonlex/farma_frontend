import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reportes - PharmaCare",
  description: "Generación y descarga de reportes del sistema",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}