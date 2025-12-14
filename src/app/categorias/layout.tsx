import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías - PharmaCare",
  description: "Gestión de categorías de medicamentos",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}